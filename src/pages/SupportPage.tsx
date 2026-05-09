import { useEffect, useState, type FormEvent } from 'react';
import Navbar from '@/components/layout/Navbar';
import StatusMessage from '@/components/shared/StatusMessage';
import TicketCard from '@/components/support/TicketCard';
import { bookingApi, supportApi } from '@/api/services';
import { useAuth } from '@/hooks/useAuth';
import type { Booking, SupportTicket } from '@/types/api';

export default function SupportPage() {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    bookingId: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    if (!token || !user) return;

    void Promise.all([
      supportApi.list(token),
      user.role === 'customer' ? bookingApi.listForCustomer(user.id, token) : Promise.resolve([]),
    ])
      .then(([ticketData, bookingData]) => {
        setTickets(ticketData);
        setBookings(bookingData);
      })
      .catch((err: Error) => setError(err.message));
  }, [token, user]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || user?.role !== 'customer') return;

    try {
      const ticket = await supportApi.create(
        {
          bookingId: formData.bookingId ? Number(formData.bookingId) : null,
          subject: formData.subject,
          message: formData.message,
        },
        token,
      );
      setTickets((current) => [ticket, ...current]);
      setFormData({ bookingId: '', subject: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create support ticket.');
    }
  };

  const handleResolve = async (ticket: SupportTicket, status: 'InProgress' | 'Resolved', resolutionNotes: string) => {
    if (!token) return;

    try {
      const updated = await supportApi.resolve(ticket.supportId, { status, resolutionNotes }, token);
      setTickets((current) => current.map((item) => (item.supportId === updated.supportId ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update ticket.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {user?.role === 'customer' && (
            <aside className="lg:col-span-4">
              <form onSubmit={handleCreate} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-4">
                <div>
                  <h1 className="text-2xl font-black text-gray-900">Contact Support</h1>
                  <p className="text-sm text-gray-500 mt-2">Create a support ticket linked to a booking whenever you need refund, payment, or stay assistance.</p>
                </div>
                <select value={formData.bookingId} onChange={(e) => setFormData((current) => ({ ...current, bookingId: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium">
                  <option value="">General question</option>
                  {bookings.map((booking) => (
                    <option key={booking.bookingId} value={booking.bookingId}>
                      #{booking.bookingId} - {booking.hotelName}
                    </option>
                  ))}
                </select>
                <input value={formData.subject} onChange={(e) => setFormData((current) => ({ ...current, subject: e.target.value }))} placeholder="Subject" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium" />
                <textarea value={formData.message} onChange={(e) => setFormData((current) => ({ ...current, message: e.target.value }))} placeholder="Tell us what happened..." rows={6} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium resize-none" />
                <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-2xl">Submit Ticket</button>
              </form>
            </aside>
          )}

          <section className={user?.role === 'customer' ? 'lg:col-span-8' : 'lg:col-span-12'}>
            <div className="mb-6">
              <h2 className="text-3xl font-black text-gray-900">{user?.role === 'admin' ? 'Support Queue' : 'My Support Tickets'}</h2>
              <p className="text-sm text-gray-500 mt-1">{user?.role === 'admin' ? 'Review, triage, and resolve customer tickets.' : 'Track open issues tied to your bookings and payments.'}</p>
            </div>

            {error ? (
              <StatusMessage title="Support unavailable" description={error} />
            ) : tickets.length === 0 ? (
              <StatusMessage title="No support tickets yet" description="Tickets will appear here once they are created." />
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <TicketCard
                    key={ticket.supportId}
                    ticket={ticket}
                    isAdmin={user?.role === 'admin'}
                    onResolve={handleResolve}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
