import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import StatusMessage from '@/components/shared/StatusMessage';
import { bookingApi, loyaltyApi, refundApi } from '@/api/services';
import { useAuth } from '@/hooks/useAuth';
import type { Booking, LoyaltySummary } from '@/types/api';
import { CalendarDays, BadgeDollarSign, ShieldCheck, RotateCcw } from 'lucide-react';

export default function BookingHistoryPage() {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loyalty, setLoyalty] = useState<LoyaltySummary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !token) return;

    void Promise.all([bookingApi.listForCustomer(user.id, token), loyaltyApi.get(user.id, token)])
      .then(([bookingData, loyaltyData]) => {
        setBookings(bookingData);
        setLoyalty(loyaltyData);
      })
      .catch((err: Error) => setError(err.message));
  }, [user, token]);

  const handleCancel = async (bookingId: number) => {
    if (!token) return;

    try {
      const updated = await refundApi.request({ bookingId, reason: 'Customer cancelled from booking history' }, token);
      setBookings((current) => current.map((booking) => (booking.bookingId === updated.bookingId ? updated : booking)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to cancel booking.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Loyalty Status</p>
              <h1 className="text-3xl font-black text-gray-900 mb-2">{loyalty?.membershipLevel ?? 'Bronze'}</h1>
              <p className="text-sm text-gray-500 mb-6">Your rewards status updates automatically whenever a paid booking is confirmed.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-blue-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Points</p>
                  <p className="text-2xl font-black text-gray-900">{loyalty?.points ?? 0}</p>
                </div>
                <div className="rounded-2xl bg-green-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-green-600 mb-2">Benefits</p>
                  <p className="text-sm font-bold text-gray-900">Member rates and faster support</p>
                </div>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-black text-gray-900">Booking History</h2>
                <p className="text-sm text-gray-500 mt-1">Confirmed, cancelled, and completed stays powered by the booking and payment tables.</p>
              </div>
            </div>

            {error ? (
              <StatusMessage title="Unable to load bookings" description={error} />
            ) : bookings.length === 0 ? (
              <StatusMessage title="No bookings yet" description="Your confirmed and pending hotel bookings will appear here." />
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.bookingId} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{booking.hotelName}</h3>
                          <span className="px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold uppercase tracking-wider">{booking.bookingStatus}</span>
                          {booking.paymentStatus && <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider">Payment {booking.paymentStatus}</span>}
                          {booking.refundStatus && <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider">Refund {booking.refundStatus}</span>}
                        </div>
                        <p className="text-gray-600 font-medium mb-4">{booking.roomName}</p>
                        <div className="grid sm:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600"><CalendarDays className="w-4 h-4 text-primary" />{booking.checkInDate} → {booking.checkOutDate}</div>
                          <div className="flex items-center gap-2 text-gray-600"><BadgeDollarSign className="w-4 h-4 text-primary" />${booking.totalPrice}</div>
                          <div className="flex items-center gap-2 text-gray-600"><ShieldCheck className="w-4 h-4 text-primary" />{booking.nights} night{booking.nights > 1 ? 's' : ''}</div>
                        </div>
                      </div>

                      {(booking.bookingStatus === 'Confirmed' || booking.bookingStatus === 'PendingPayment') && (
                        <button onClick={() => handleCancel(booking.bookingId)} className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors">
                          <RotateCcw className="w-4 h-4" />
                          Cancel & Refund
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
