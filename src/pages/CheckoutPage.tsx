import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { motion } from 'motion/react';
import { ShieldCheck, ChevronLeft, CreditCard, CheckCircle, Calendar, Bed, MapPin } from 'lucide-react';
import { bookingApi, hotelApi, paymentApi, roomApi } from '@/api/services';
import type { Booking, HotelDetails, Room } from '@/types/api';
import { useAuth } from '@/hooks/useAuth';
import StatusMessage from '@/components/shared/StatusMessage';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, user, refreshSession } = useAuth();
  const hotelId = Number(searchParams.get('hotelId'));
  const roomId = Number(searchParams.get('roomId'));
  const checkIn = searchParams.get('checkIn') ?? '';
  const checkOut = searchParams.get('checkOut') ?? '';
  const [hotel, setHotel] = useState<HotelDetails | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<Booking | null>(null);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  useEffect(() => {
    if (!hotelId || !roomId) return;

    void Promise.all([hotelApi.get(hotelId), roomApi.get(roomId)])
      .then(([hotelData, roomData]) => {
        setHotel(hotelData);
        setRoom(roomData);
      })
      .catch((err: Error) => setError(err.message));
  }, [hotelId, roomId]);

  useEffect(() => {
    if (!user) return;
    const [firstName, ...lastNameParts] = user.fullName.split(' ');
    setFormData((current) => ({
      ...current,
      firstName: current.firstName || firstName || '',
      lastName: current.lastName || lastNameParts.join(' '),
      email: current.email || user.email,
    }));
  }, [user]);

  const nights = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
  }, [checkIn, checkOut]);

  const totalRoomPrice = nights * (room?.pricePerNight ?? 0);
  const taxesAndFees = Math.round(totalRoomPrice * 0.15);
  const grandTotal = totalRoomPrice + taxesAndFees;

  if (!hotelId || !roomId || !checkIn || !checkOut) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      navigate('/login', { state: { redirectTo: window.location.pathname + window.location.search } });
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const booking = await bookingApi.create({ roomId, checkInDate: checkIn, checkOutDate: checkOut }, token);
      const payment = await paymentApi.pay(
        {
          bookingId: booking.bookingId,
          amount: booking.totalPrice,
          paymentMethod: 'card',
          cardLast4: formData.cardNumber.slice(-4),
        },
        token,
      );
      setSuccess(payment.booking);
      setPaymentReference(payment.payment?.transactionReference ?? null);
      await refreshSession();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to complete checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success && hotel && room) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4 pt-24">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-lg w-full text-center border border-gray-100">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12" />
            </motion.div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 font-medium mb-8">Thank you, {formData.firstName}. Your reservation at <strong>{hotel.name}</strong> is confirmed and paid.</p>
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Booking #</span><span className="font-bold text-gray-900">TRIP-{success.bookingId}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Dates</span><span className="font-bold text-gray-900">{checkIn} to {checkOut}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Room</span><span className="font-bold text-gray-900">{room.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Payment Status</span><span className="font-bold text-green-600">{success.paymentStatus}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Reference</span><span className="font-bold text-gray-900">{paymentReference}</span></div>
            </div>
            <button onClick={() => navigate('/bookings')} className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-blue-500/30">View My Bookings</button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!hotel || !room) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 pt-32">
          <StatusMessage title="Loading checkout" description={error || 'Fetching your selected hotel and room details.'} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-28 pb-20">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-primary font-bold mb-8 transition-colors">
          <ChevronLeft className="w-5 h-5" />
          Back to Hotel Details
        </button>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">Secure Checkout</h1>

        <div className="flex flex-col-reverse lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-8">
            <motion.form initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onSubmit={handleCheckout} className="space-y-8">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Guest Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">First Name</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Last Name</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Doe" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="john.doe@example.com" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                  <div className="flex gap-2 text-primary text-xl">
                    <CreditCard className="w-8 h-8" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Card Number</label>
                    <input required type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="0000 0000 0000 0000" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Expiry Date</label>
                      <input required type="text" name="expiry" value={formData.expiry} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">CVC</label>
                      <input required type="text" name="cvc" value={formData.cvc} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="123" maxLength={4} />
                    </div>
                  </div>
                </div>
              </div>

              {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

              <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-primary-dark transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isSubmitting ? 'Processing Payment...' : `Confirm & Pay $${grandTotal}`}
              </button>
            </motion.form>
          </div>

          <div className="lg:w-1/3">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="sticky top-28 bg-white border border-gray-100 rounded-[2rem] p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Booking Details</h3>

              <div className="flex gap-4 mb-6">
                <img src={hotel.heroImage ?? hotel.images[0]} className="w-20 h-20 rounded-xl object-cover" alt="Hotel" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold text-gray-900 line-clamp-2">{hotel.name}</h4>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="line-clamp-1">{hotel.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-6 mb-6">
                <div className="flex bg-gray-50 rounded-xl p-3 items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dates</div>
                    <div className="text-sm font-semibold">{checkIn} → {checkOut}</div>
                  </div>
                </div>
                <div className="flex bg-gray-50 rounded-xl p-3 items-center gap-3">
                  <Bed className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Room Type</div>
                    <div className="text-sm font-semibold">{room.name}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-3 mb-6">
                <h4 className="font-bold text-sm text-gray-900 mb-4">Price Summary</h4>
                <div className="flex justify-between text-sm"><span className="text-gray-600">${room.pricePerNight} x {nights} night{nights > 1 ? 's' : ''}</span><span className="font-semibold">${totalRoomPrice}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Taxes & Fees (15%)</span><span className="font-semibold">${taxesAndFees}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Booking confirmation threshold</span><span className="font-semibold">Paid in full</span></div>
                <div className="border-t border-dashed border-gray-200 pt-3 mt-3 flex justify-between items-center"><span className="font-bold text-gray-900">Total</span><span className="text-2xl font-black text-gray-900">${grandTotal}</span></div>
              </div>

              <div className="bg-green-50 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-green-700 leading-relaxed">Your booking will be confirmed only after the payment API records a successful payment.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
