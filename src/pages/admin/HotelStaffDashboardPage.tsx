import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import StatusMessage from '@/components/shared/StatusMessage';
import { bookingApi, supportApi } from '@/api/services';
import { useAuth } from '@/hooks/useAuth';
import type { Booking, SupportTicket } from '@/types/api';

export default function HotelStaffDashboardPage() {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'bookings' | 'support'>('bookings');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    setIsLoading(true);
    void Promise.all([
      bookingApi.listAll(token),
      supportApi.list(token),
    ])
      .then(([bookingData, ticketData]) => {
        setBookings(bookingData);
        setTickets(ticketData);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [token]);

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
    const reason = window.prompt('Reason for cancellation and refund:');
    if (reason === null) return;
    
    try {
      await bookingApi.cancel(bookingId, reason || 'Staff cancelled', token);
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700';
      case 'CheckedIn':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-gray-100 text-gray-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-28 pb-20 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Hotel Staff Dashboard</h1>
            <p className="text-sm text-gray-500 mt-2">
              Manage guest check-ins, bookings, and support for your assigned hotels.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-xl font-bold transition-colors ${
                activeTab === 'bookings' 
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`px-4 py-2 rounded-xl font-bold transition-colors ${
                activeTab === 'support' 
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Support Tickets
            </button>
          </div>
        </div>

        {user?.ownerId && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <p className="text-sm text-blue-800">
              <span className="font-bold">Assigned to:</span> Hotel Owner ID #{user.ownerId}
            </p>
          </div>
        )}

        {error && <StatusMessage title="Action failed" description={error} />}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {activeTab === 'bookings' && (
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-gray-900">Guest Bookings</h2>
                  <span className="text-sm text-gray-500">{bookings.length} total</span>
                </div>
                
                <div className="space-y-4">
                  {bookings.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-400 text-lg">No bookings found</p>
                      <p className="text-gray-400 text-sm">Bookings for your assigned hotels will appear here</p>
                    </div>
                  )}
                  
                  {bookings.map((booking) => (
                    <div key={booking.bookingId} className="rounded-2xl bg-gray-50 px-5 py-5 hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-gray-400">#{booking.bookingId}</span>
                            <h3 className="font-bold text-gray-900 text-lg">{booking.hotelName}</h3>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${getStatusBadgeClass(booking.bookingStatus)}`}>
                              {booking.bookingStatus}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 font-medium">{booking.roomName}</p>
                          <p className="text-sm text-gray-500">
                            {booking.checkInDate} → {booking.checkOutDate} 
                            <span className="text-gray-400">({booking.nights} nights)</span>
                          </p>
                          
                          <div className="inline-block mt-2 p-3 bg-white rounded-xl border border-gray-100">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Guest Information</p>
                            <p className="text-sm font-bold text-gray-900">{booking.customerName}</p>
                            <p className="text-xs text-gray-500">{booking.customerEmail}</p>
                          </div>
                        </div>
                        
                        <div className="text-right lg:min-w-[140px]">
                          <p className="text-2xl font-black text-gray-900">₱{booking.totalPrice.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{booking.paymentStatus}</p>
                          {booking.coinsRedeemed > 0 && (
                            <p className="text-xs text-orange-600 font-medium">
                              {booking.coinsRedeemed} coins redeemed
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {booking.internalNotes && (
                        <div className="mt-4 bg-orange-50 border border-orange-100 p-3 rounded-xl">
                          <p className="text-[10px] text-orange-500 font-black uppercase tracking-wider mb-1">Internal Staff Notes</p>
                          <p className="text-sm text-orange-800 font-medium">{booking.internalNotes}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-gray-200">
                        <button 
                          onClick={() => handleUpdateNotes(booking.bookingId, booking.internalNotes)} 
                          className="px-4 py-2 bg-white text-gray-600 text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          {booking.internalNotes ? 'Edit Notes' : 'Add Notes'}
                        </button>
                        
                        {booking.bookingStatus === 'Confirmed' && (
                          <>
                            <button 
                              onClick={() => handleCheckInBooking(booking.bookingId)} 
                              className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-primary-dark transition-colors"
                            >
                              Check-in Guest
                            </button>
                            <button 
                              onClick={() => handleCancelBooking(booking.bookingId)} 
                              className="px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 hover:bg-red-100 transition-colors"
                            >
                              Cancel & Refund
                            </button>
                          </>
                        )}
                        
                        {booking.bookingStatus === 'CheckedIn' && (
                          <button 
                            onClick={() => handleCompleteBooking(booking.bookingId)} 
                            className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-green-500/20 hover:bg-green-700 transition-colors"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-gray-900">Support Tickets</h2>
                  <span className="text-sm text-gray-500">{tickets.length} total</span>
                </div>
                
                <div className="space-y-4">
                  {tickets.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-400 text-lg">No support tickets</p>
                      <p className="text-gray-400 text-sm">Guest inquiries will appear here</p>
                    </div>
                  )}
                  
                  {tickets.map((ticket) => (
                    <div key={ticket.supportId} className="rounded-2xl bg-gray-50 px-5 py-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900">{ticket.subject}</h3>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                              ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' : 
                              ticket.status === 'InProgress' ? 'bg-orange-100 text-orange-700' : 
                              'bg-green-100 text-green-700'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <span>Customer #{ticket.customerId}</span>
                            {ticket.bookingId && <span>Booking #{ticket.bookingId}</span>}
                            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-xl border border-gray-100 mb-4">
                        <p className="text-sm text-gray-600 italic">"{ticket.message}"</p>
                      </div>
                      
                      {ticket.resolutionNotes && (
                        <div className="bg-green-50 border border-green-100 p-4 rounded-xl mb-4">
                          <p className="text-[10px] text-green-600 font-black uppercase tracking-wider mb-1">Resolution Notes</p>
                          <p className="text-sm text-green-800 font-medium">{ticket.resolutionNotes}</p>
                          {ticket.resolverType && (
                            <p className="text-xs text-green-600 mt-2">
                              Resolved by {ticket.resolverType}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {ticket.status !== 'Resolved' && (
                        <div className="flex gap-2">
                          {ticket.status === 'Open' && (
                            <button 
                              onClick={() => handleResolveTicket(ticket.supportId, 'InProgress')} 
                              className="px-4 py-2 bg-white text-orange-600 text-sm font-bold rounded-xl border border-orange-100 hover:bg-orange-50 transition-colors"
                            >
                              Take Ownership
                            </button>
                          )}
                          <button 
                            onClick={() => handleResolveTicket(ticket.supportId, 'Resolved')} 
                            className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-primary-dark transition-colors"
                          >
                            Mark Resolved
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
