import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Navbar from '@/components/layout/Navbar';
import StatusMessage from '@/components/shared/StatusMessage';
import { bookingApi, hotelApi, roomApi, supportApi } from '@/api/services';
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
  const { token } = useAuth();
  const [hotels, setHotels] = useState<HotelSummary[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<number>(0);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotelForm, setHotelForm] = useState(emptyHotelForm);
  const [roomForm, setRoomForm] = useState(emptyRoomForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    void Promise.all([hotelApi.list(), bookingApi.listAll(token), supportApi.list(token)])
      .then(([hotelData, bookingData, ticketData]) => {
        setHotels(hotelData);
        setBookings(bookingData);
        setTickets(ticketData);
        setSelectedHotelId(hotelData[0]?.id ?? 0);
      })
      .catch((err: Error) => setError(err.message));
  }, [token]);

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
    const data = await hotelApi.list();
    setHotels(data);
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
                      <p className="text-sm text-gray-500">${room.pricePerNight} per night</p>
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
              <div className="space-y-3">
                {bookings.slice(0, 8).map((booking) => (
                  <div key={booking.bookingId} className="rounded-2xl bg-gray-50 px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-gray-900">#{booking.bookingId} {booking.hotelName}</p>
                        <p className="text-sm text-gray-500">{booking.roomName} • {booking.checkInDate} → {booking.checkOutDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{booking.bookingStatus}</p>
                        <p className="text-sm text-gray-500">{booking.paymentStatus}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900 mb-4">Support Tickets</h2>
              <div className="space-y-3">
                {tickets.slice(0, 6).map((ticket) => (
                  <div key={ticket.supportId} className="rounded-2xl bg-gray-50 px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-gray-900">{ticket.subject}</p>
                        <p className="text-sm text-gray-500">{ticket.status} • Customer #{ticket.customerId}</p>
                      </div>
                    </div>
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
