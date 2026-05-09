import type { SupportTicket } from '@/types/api';
import { useState } from 'react';

interface TicketCardProps {
  ticket: SupportTicket;
  isAdmin: boolean;
  onResolve: (ticket: SupportTicket, status: 'InProgress' | 'Resolved', notes: string) => Promise<void>;
}

export default function TicketCard({ ticket, isAdmin, onResolve }: TicketCardProps) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async (status: 'InProgress' | 'Resolved') => {
    setIsSubmitting(true);
    try {
      await onResolve(ticket, status, notes);
      if (status === 'Resolved') {
        setNotes('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex flex-wrap gap-3 items-center mb-3">
            <h3 className="text-xl font-bold text-gray-900">{ticket.subject}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              ticket.status === 'Resolved' ? 'bg-green-50 text-green-700' : 
              ticket.status === 'InProgress' ? 'bg-amber-50 text-amber-700' : 
              'bg-blue-50 text-primary'
            }`}>
              {ticket.status}
            </span>
            {ticket.bookingId && (
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">
                Booking #{ticket.bookingId}
              </span>
            )}
          </div>
          <p className="text-gray-600 font-medium mb-3">{ticket.message}</p>
          {ticket.resolutionNotes && (
            <div className="mt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Admin Resolution</p>
              <p className="text-sm text-green-700 bg-green-50 rounded-2xl p-4 font-medium border border-green-100">
                {ticket.resolutionNotes}
              </p>
            </div>
          )}
        </div>

        {isAdmin && ticket.status !== 'Resolved' && (
          <div className="w-full md:w-72 space-y-3">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add resolution notes"
              rows={4}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              disabled={isSubmitting}
            />
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAction('InProgress')}
                disabled={isSubmitting}
                className="rounded-2xl py-3 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                In Progress
              </button>
              <button
                onClick={() => handleAction('Resolved')}
                disabled={isSubmitting}
                className="rounded-2xl py-3 bg-primary text-white font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Resolve
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
