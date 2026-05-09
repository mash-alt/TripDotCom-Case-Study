import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Navbar from '@/components/layout/Navbar';
import StatusMessage from '@/components/shared/StatusMessage';
import { bookingApi, customerApi, hotelApi, roomApi, supportApi } from '@/api/services';
import { useAuth } from '@/hooks/useAuth';
import type { Booking, HotelDetails, HotelSummary, Room, SupportTicket } from '@/types/api';

const emptyHotelForm = {
  id: 0,
  name: '',
  city: '',
  country: '',
  address: '',
  description: '',
  stars: 5,
  rating: 0,
  reviewsCount: 0,
  images: '',
  amenities: '',
};

const emptyRoomForm = {
  id: 0,
  hotelId: 0,
  name: '',
  roomType: '',
  description: '',
  bedType: '',
  sizeSqm: 30,
  capacityAdults: 2,
  capacityChildren: 0,
  pricePerNight: 150,
  totalInventory: 1,
  imageUrl: '',
  amenities: '',
};

export default function AdminDashboardPage() {
  const { token, user } = useAuth();
  const [hotels, setHotels] = useState<HotelSummary[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<number>(0);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotelForm, setHotelForm] = useState(emptyHotelForm);
  const [roomForm, setRoomForm] = useState(emptyRoomForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    void Promise.all([
      hotelApi.list({ adminId: user?.id === 1 ? undefined : user?.id }),
      bookingApi.listAll(token),
      supportApi.list(token),
      customerApi.list(token),
    ])
      .then(([hotelData, bookingData, ticketData, customerData]) => {
        setHotels(hotelData);
        setBookings(bookingData);
        setTickets(ticketData);
        setCustomers(customerData);
        setSelectedHotelId(hotelData[0]?.id ?? 0);
      })
      .catch((err: Error) => setError(err.message));
  }, [token, user]);

  useEffect(() => {
    if (!selectedHotelId) return;

    void roomApi
      .list(selectedHotelId)
      .then((data) => {
        setRooms(data);
        setRoomForm((current) => ({ ...current, hotelId: selectedHotelId }));
      })
      .catch((err: Error) => setError(err.message));
  }, [selectedHotelId]);

  const selectedHotel = useMemo(() => hotels.find((hotel) => hotel.id === selectedHotelId) ?? null, [hotels, selectedHotelId]);

  const refreshHotels = async () => {
    const data = await hotelApi.list({ adminId: user?.id === 1 ? undefined : user?.id });
    setHotels(data);
  };

  const refreshBookings = async () => {
    if (!token) return;
    setBookings(await bookingApi.listAll(token));
  };

  const refreshTickets = async () => {
    if (!token) return;
    setTickets(await supportApi.list(token));
  };

  const handleCheckInBooking = async (bookingId: number) => {
    if (!token || !window.confirm('Mark this guest as checked-in?')) return;
    try {
      await bookingApi.checkIn(bookingId, token);
      await refreshBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check-in guest');
    }
  };

  const handleCompleteBooking = async (bookingId: number) => {
    if (!token || !window.confirm('Mark this booking as completed?')) return;
    try {
      await bookingApi.complete(bookingId, token);
      await refreshBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete booking');
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!token) return;
    const reason = window.prompt('Reason for administrative cancellation and refund:');
    if (reason === null) return;
    
    try {
      await bookingApi.cancel(bookingId, reason || 'Admin cancelled', token);
      await refreshBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    }
  };

  const handleResolveTicket = async (ticketId: number, status: 'InProgress' | 'Resolved') => {
    if (!token) return;
    const notes = status === 'Resolved' ? (window.prompt('Resolution notes:') ?? '') : '';
    
    try {
      await supportApi.resolve(ticketId, { status, resolutionNotes: notes }, token);
      await refreshTickets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket');
    }
  };

  const handleUpdateNotes = async (bookingId: number, currentNotes: string | null) => {
    if (!token) return;
    const notes = window.prompt('Internal operational notes (private to staff):', currentNotes ?? '');
    if (notes === null) return;

    try {
      await bookingApi.updateNotes(bookingId, notes, token);
      await refreshBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update notes');
    }
  };

  const handleHotelSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const payload = {
      name: hotelForm.name,
      city: hotelForm.city,
      country: hotelForm.country,
      address: hotelForm.address,
      description: hotelForm.description,
      stars: Number(hotelForm.stars),
      rating: Number(hotelForm.rating),
      reviewsCount: Number(hotelForm.reviewsCount),
      images: hotelForm.images.split(',').map((item) => item.trim()).filter(Boolean),
      amenities: hotelForm.amenities.split(',').map((item) => item.trim()).filter(Boolean),
    };

    try {
      if (hotelForm.id) {
        await hotelApi.update(hotelForm.id, payload as Partial<HotelDetails>, token);
      } else {
        await hotelApi.create(payload as Partial<HotelDetails>, token);
      }
      setHotelForm(emptyHotelForm);
      await refreshHotels();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save hotel.');
    }
  };

  const handleRoomSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const payload = {
      hotelId: Number(roomForm.hotelId),
      name: roomForm.name,
      roomType: roomForm.roomType,
      description: roomForm.description,
      bedType: roomForm.bedType,
      sizeSqm: Number(roomForm.sizeSqm),
      capacityAdults: Number(roomForm.capacityAdults),
      capacityChildren: Number(roomForm.capacityChildren),
      pricePerNight: Number(roomForm.pricePerNight),
      totalInventory: Number(roomForm.totalInventory),
      imageUrl: roomForm.imageUrl,
      amenities: roomForm.amenities.split(',').map((item) => item.trim()).filter(Boolean),
    };

    try {
      if (roomForm.id) {
        await roomApi.update(roomForm.id, payload, token);
      } else {
        await roomApi.create(payload, token);
      }
      setRoomForm({ ...emptyRoomForm, hotelId: selectedHotelId });
      setRooms(await roomApi.list(selectedHotelId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save room.');
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-28 pb-20 space-y-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-2">Manage hotels, rooms, bookings, payments, refunds, and support from one place.</p>
        </div>

        {error && <StatusMessage title="Admin action failed" description={error} />}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <section className="xl:col-span-7 space-y-8">
            <form onSubmit={handleHotelSubmit} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900">Hotel Management</h2>
                <button type="button" onClick={() => setHotelForm(emptyHotelForm)} className="text-sm font-bold text-primary">New Hotel</button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input value={hotelForm.name} onChange={(e) => setHotelForm((current) => ({ ...current, name: e.target.value }))} placeholder="Hotel name" className="bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
                <input value={hotelForm.address} onChange={(e) => setHotelForm((current) => ({ ...current, address: e.target.value }))} placeholder="Address" className="bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
                <input value={hotelForm.city} onChange={(e) => setHotelForm((current) => ({ ...current, city: e.target.value }))} placeholder="City" className="bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
                <input value={hotelForm.country} onChange={(e) => setHotelForm((current) => ({ ...current, country: e.target.value }))} placeholder="Country" className="bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
                <input type="number" value={hotelForm.stars} onChange={(e) => setHotelForm((current) => ({ ...current, stars: Number(e.target.value) }))} placeholder="Stars" className="bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
                <input type="number" value={hotelForm.rating} onChange={(e) => setHotelForm((current) => ({ ...current, rating: Number(e.target.value) }))} placeholder="Rating" className="bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
              </div>
              <textarea value={hotelForm.description} onChange={(e) => setHotelForm((current) => ({ ...current, description: e.target.value }))} placeholder="Description" rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium resize-none" />
              <input value={hotelForm.images} onChange={(e) => setHotelForm((current) => ({ ...current, images: e.target.value }))} placeholder="Image URLs, comma separated" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
              <input value={hotelForm.amenities} onChange={(e) => setHotelForm((current) => ({ ...current, amenities: e.target.value }))} placeholder="Amenities, comma separated" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
              <button type="submit" className="bg-primary text-white font-bold px-6 py-3 rounded-2xl">{hotelForm.id ? 'Update Hotel' : 'Add Hotel'}</button>
            </form>

            <form onSubmit={handleRoomSubmit} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900">Room Management</h2>
                <select value={selectedHotelId} onChange={(e) => setSelectedHotelId(Number(e.target.value))} className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 font-medium">
                  {hotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                  ))}
                </select>
              </div>
              {selectedHotel ? <p className="text-sm text-gray-500">Editing rooms for {selectedHotel.name}</p> : null}
              <div className="grid md:grid-cols-2 gap-4">
                <input value={roomForm.name} onChange={(e) => setRoomForm((current) => ({ ...current, name: e.target.value }))} placeholder="Room name" className="bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
                <input value={roomForm.roomType} onChange={(e) => setRoomForm((current) => ({ ...current, roomType: e.target.value }))} placeholder="Room type" className="bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
                <input value={roomForm.bedType} onChange={(e) => setRoomForm((current) => ({ ...current, bedType: e.target.value }))} placeholder="Bed type" className="bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
                <input type="number" value={roomForm.sizeSqm} onChange={(e) => setRoomForm((current) => ({ ...current, sizeSqm: Number(e.target.value) }))} placeholder="Size sqm" className="bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
                <input type="number" value={roomForm.capacityAdults} onChange={(e) => setRoomForm((current) => ({ ...current, capacityAdults: Number(e.target.value) }))} placeholder="Adult capacity" className="bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
                <input type="number" value={roomForm.capacityChildren} onChange={(e) => setRoomForm((current) => ({ ...current, capacityChildren: Number(e.target.value) }))} placeholder="Child capacity" className="bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
                <input type="number" value={roomForm.pricePerNight} onChange={(e) => setRoomForm((current) => ({ ...current, pricePerNight: Number(e.target.value) }))} placeholder="Price per night" className="bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
                <input type="number" value={roomForm.totalInventory} onChange={(e) => setRoomForm((current) => ({ ...current, totalInventory: Number(e.target.value) }))} placeholder="Inventory" className="bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
              </div>
              <textarea value={roomForm.description} onChange={(e) => setRoomForm((current) => ({ ...current, description: e.target.value }))} placeholder="Room description" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium resize-none" />
              <input value={roomForm.imageUrl} onChange={(e) => setRoomForm((current) => ({ ...current, imageUrl: e.target.value }))} placeholder="Room image URL" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
              <input value={roomForm.amenities} onChange={(e) => setRoomForm((current) => ({ ...current, amenities: e.target.value }))} placeholder="Room amenities, comma separated" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
              <button type="submit" className="bg-primary text-white font-bold px-6 py-3 rounded-2xl">{roomForm.id ? 'Update Room' : 'Add Room'}</button>
            </form>
          </section>

          <aside className="xl:col-span-5 space-y-8">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900 mb-4">Hotels</h2>
              <div className="space-y-3">
                {hotels.map((hotel) => (
                  <div key={hotel.id} className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                    <div>
                      <p className="font-bold text-gray-900">{hotel.name}</p>
                      <p className="text-sm text-gray-500">{hotel.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setHotelForm({
                        id: hotel.id,
                        name: hotel.name,
                        city: hotel.city,
                        country: hotel.country,
                        address: hotel.address,
                        description: hotel.description,
                        stars: hotel.stars,
                        rating: hotel.rating,
                        reviewsCount: hotel.reviewsCount,
                        images: hotel.heroImage ?? '',
                        amenities: hotel.amenities.join(', '),
                      })} className="px-3 py-2 rounded-xl bg-white text-gray-700 font-bold">Edit</button>
                      <button onClick={async () => { if (!token) return; await hotelApi.remove(hotel.id, token); await refreshHotels(); }} className="px-3 py-2 rounded-xl bg-red-50 text-red-600 font-bold">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900 mb-4">Rooms</h2>
              <div className="space-y-3">
                {rooms.map((room) => (
                  <div key={room.id} className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                    <div>
                      <p className="font-bold text-gray-900">{room.name}</p>
                      <p className="text-sm text-gray-500">₱{room.pricePerNight.toLocaleString()} per night</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setRoomForm({
                        id: room.id,
                        hotelId: room.hotelId,
                        name: room.name,
                        roomType: room.roomType,
                        description: room.description,
                        bedType: room.bedType,
                        sizeSqm: room.sizeSqm,
                        capacityAdults: room.capacityAdults,
                        capacityChildren: room.capacityChildren,
                        pricePerNight: room.pricePerNight,
                        totalInventory: room.totalInventory,
                        imageUrl: room.imageUrl ?? '',
                        amenities: room.amenities.join(', '),
                      })} className="px-3 py-2 rounded-xl bg-white text-gray-700 font-bold">Edit</button>
                      <button onClick={async () => { if (!token) return; await roomApi.remove(room.id, token); setRooms(await roomApi.list(selectedHotelId)); }} className="px-3 py-2 rounded-xl bg-red-50 text-red-600 font-bold">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900 mb-4">Booking Management</h2>
              <div className="space-y-4">
                {bookings.slice(0, 15).map((booking) => (
                  <div key={booking.bookingId} className="rounded-2xl bg-gray-50 px-4 py-3">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-gray-900">#{booking.bookingId} {booking.hotelName}</p>
                          <p className="text-sm text-gray-500 font-medium">{booking.roomName} • {booking.checkInDate} → {booking.checkOutDate}</p>
                          <div className="mt-2 p-2 bg-blue-50/50 rounded-xl border border-blue-100/50">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Guest Identity</p>
                            <p className="text-xs font-bold text-gray-900">{booking.customerName}</p>
                            <p className="text-[10px] font-medium text-gray-500">{booking.customerEmail}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${booking.bookingStatus === 'Confirmed' ? 'text-green-600' : 'text-gray-900'}`}>{booking.bookingStatus}</p>
                          <p className="text-sm text-gray-500">{booking.paymentStatus}</p>
                          <p className="text-xs font-black">₱{booking.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {booking.internalNotes && (
                        <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl">
                          <p className="text-[10px] text-orange-400 font-black uppercase tracking-wider mb-1">Internal Staff Notes</p>
                          <p className="text-xs text-orange-800 font-medium italic">"{booking.internalNotes}"</p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2 border-t border-gray-200">
                        <button onClick={() => handleUpdateNotes(booking.bookingId, booking.internalNotes)} className="flex-1 bg-white text-gray-500 text-xs font-bold py-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">Notes</button>
                        {booking.bookingStatus === 'Confirmed' && (
                          <>
                            <button onClick={() => handleCheckInBooking(booking.bookingId)} className="flex-1 bg-primary text-white text-xs font-bold py-2 rounded-xl shadow-lg shadow-blue-500/20 hover:bg-primary-dark transition-colors">Check-in</button>
                            <button onClick={() => handleCancelBooking(booking.bookingId)} className="flex-1 bg-red-50 text-red-600 text-xs font-bold py-2 rounded-xl border border-red-100 hover:bg-red-100 transition-colors">Refund</button>
                          </>
                        )}
                        {booking.bookingStatus === 'CheckedIn' && (
                          <button onClick={() => handleCompleteBooking(booking.bookingId)} className="flex-1 bg-green-600 text-white text-xs font-bold py-2 rounded-xl shadow-lg shadow-green-500/20 hover:bg-green-700 transition-colors">Mark Completed</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900 mb-4">Guest Directory</h2>
              <div className="space-y-3">
                {customers.map((guest) => (
                  <div key={guest.id} className="rounded-2xl bg-gray-50 px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{guest.fullName}</p>
                      <p className="text-xs text-gray-500">{guest.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-primary">{guest.membershipLevel}</p>
                      <p className="text-xs font-bold text-gray-900">{guest.loyaltyPoints} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900 mb-4">Support Tickets</h2>
              <div className="space-y-4">
                {tickets.slice(0, 10).map((ticket) => (
                  <div key={ticket.supportId} className="rounded-2xl bg-gray-50 px-4 py-4 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-gray-900">{ticket.subject}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                            ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' : 
                            ticket.status === 'InProgress' ? 'bg-orange-100 text-orange-700' : 
                            'bg-green-100 text-green-700'
                          }`}>{ticket.status}</span>
                          <span className="text-xs text-gray-500">Customer #{ticket.customerId}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic bg-white/50 p-2 rounded-xl">"{ticket.message}"</p>
                    {ticket.resolutionNotes && (
                      <p className="text-xs text-green-700 font-bold bg-green-50 p-2 rounded-xl border border-green-100">Notes: {ticket.resolutionNotes}</p>
                    )}
                    {ticket.status !== 'Resolved' && (
                      <div className="flex gap-2">
                        {ticket.status === 'Open' && (
                          <button onClick={() => handleResolveTicket(ticket.supportId, 'InProgress')} className="flex-1 bg-white text-orange-600 text-[10px] font-black uppercase py-2 rounded-xl border border-orange-100">Take Ticket</button>
                        )}
                        <button onClick={() => handleResolveTicket(ticket.supportId, 'Resolved')} className="flex-1 bg-primary text-white text-[10px] font-black uppercase py-2 rounded-xl shadow-lg shadow-blue-500/20">Resolve</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
