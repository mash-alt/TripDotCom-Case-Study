import { withTransaction } from '../config/db.js';
import * as bookingModel from '../models/bookingModel.js';
import * as roomModel from '../models/roomModel.js';
import * as paymentModel from '../models/paymentModel.js';
import * as refundModel from '../models/refundModel.js';
import * as loyaltyModel from '../models/loyaltyModel.js';
import { ApiError } from '../utils/apiError.js';
import { calculateMembershipLevel, calculateNights, calculateTripCoinsEarned, isRefundEligible } from '../utils/booking.js';

export async function createBooking(input: {
  customerId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  coinsRedeemed?: number;
}) {
  const room = await roomModel.getRoomById(input.roomId);

  if (!room) {
    throw new ApiError(404, 'Room not found.');
  }

  const nights = calculateNights(input.checkInDate, input.checkOutDate);
  const overlap = await bookingModel.findOverlappingBooking(input.roomId, input.checkInDate, input.checkOutDate);

  if (overlap) {
    throw new ApiError(409, 'This room is already booked for the selected dates.');
  }

  let discountApplied = 0;
  if (input.coinsRedeemed) {
    const loyalty = await loyaltyModel.findLoyaltyByCustomerId(input.customerId);
    if (!loyalty || loyalty.points < input.coinsRedeemed) {
      throw new ApiError(400, 'Insufficient Trip Coins.');
    }
    // 100 points = ₱50
    discountApplied = (input.coinsRedeemed / 100) * 50;
  }

  const finalPrice = Math.max(0, nights * Number(room.pricePerNight) - discountApplied);

  const bookingId = await withTransaction(async (connection) => {
    if (input.coinsRedeemed) {
      const loyalty = await loyaltyModel.findLoyaltyByCustomerId(input.customerId, connection);
      const nextPoints = (loyalty?.points ?? 0) - input.coinsRedeemed!;
      await loyaltyModel.updateLoyalty(input.customerId, nextPoints, calculateMembershipLevel(nextPoints), connection);
    }

    return bookingModel.createBooking(
      {
        customerId: input.customerId,
        roomId: input.roomId,
        checkInDate: input.checkInDate,
        checkOutDate: input.checkOutDate,
        nights,
        totalPrice: finalPrice,
        coinsRedeemed: input.coinsRedeemed ?? 0,
        discountApplied,
      },
      connection,
    );
  });

  return getBooking(bookingId);
}

export async function getBooking(bookingId: number) {
  const booking = await bookingModel.findBookingById(bookingId);

  if (!booking) {
    throw new ApiError(404, 'Booking not found.');
  }

  return booking;
}

export async function listBookings(customerId?: number, adminId?: number) {
  return customerId ? bookingModel.listBookingsForCustomer(customerId) : bookingModel.listAllBookings(adminId);
}

export async function confirmBookingPayment(input: {
  bookingId: number;
  customerId: number;
  amount: number;
  paymentMethod: string;
  cardLast4: string;
}) {
  const booking = await getBooking(input.bookingId);

  if (booking.customerId !== input.customerId) {
    throw new ApiError(403, 'This booking does not belong to the authenticated customer.');
  }

  if (booking.bookingStatus === 'Cancelled') {
    throw new ApiError(400, 'Cancelled bookings cannot be paid.');
  }

  if (Number(booking.totalPrice) !== Number(input.amount)) {
    throw new ApiError(400, 'Payment amount must match the booking total.');
  }

  const transactionReference = `PAY-${booking.bookingId}-${Date.now().toString(36).toUpperCase()}`;

  await withTransaction(async (connection) => {
    await paymentModel.upsertPayment(
      {
        bookingId: input.bookingId,
        amount: input.amount,
        paymentStatus: 'Paid',
        paymentMethod: `${input.paymentMethod.toUpperCase()} •••• ${input.cardLast4}`,
        transactionReference,
      },
      connection,
    );
    await bookingModel.updateBookingStatus(input.bookingId, 'Confirmed', connection);

    // Award Trip Coins immediately upon successful payment
    const loyalty = await loyaltyModel.findLoyaltyByCustomerId(input.customerId, connection);
    const currentTier = loyalty?.membershipLevel ?? 'Silver';
    const pointsEarned = calculateTripCoinsEarned(Number(booking.totalPrice), currentTier);

    const nextPoints = (loyalty?.points ?? 0) + pointsEarned;
    await loyaltyModel.updateLoyalty(input.customerId, nextPoints, calculateMembershipLevel(nextPoints), connection);
  });

  return {
    booking: await getBooking(input.bookingId),
    payment: await paymentModel.getPaymentByBookingId(input.bookingId),
  };
}

export async function checkInBooking(bookingId: number) {
  await withTransaction(async (connection) => {
    await bookingModel.updateBookingStatus(bookingId, 'CheckedIn', connection);
  });
  return getBooking(bookingId);
}

export async function completeBooking(bookingId: number) {
  const booking = await getBooking(bookingId);

  await withTransaction(async (connection) => {
    await bookingModel.updateBookingStatus(bookingId, 'Completed', connection);
  });

  return getBooking(bookingId);
}

export async function cancelBooking(input: { bookingId: number; customerId?: number; reason: string; force?: boolean }) {
  try {
    const booking = await getBooking(input.bookingId);

    if (input.customerId && booking.customerId !== input.customerId) {
      throw new ApiError(403, 'This booking does not belong to the authenticated customer.');
    }

    if (booking.bookingStatus === 'Cancelled') {
      throw new ApiError(400, 'Booking is already cancelled.');
    }

    if (!isRefundEligible(booking.checkInDate, booking.createdAt) && !input.force) {
      throw new ApiError(400, 'This booking is no longer eligible for a refund (must be at least 48 hours before check-in or within the 30-minute grace period).');
    }

    const existingPayment = await paymentModel.getPaymentByBookingId(input.bookingId);

    if (!existingPayment || existingPayment.paymentStatus !== 'Paid') {
      throw new ApiError(400, 'Only paid bookings can be cancelled and refunded.');
    }

    await withTransaction(async (connection) => {
      await refundModel.createRefund(
        {
          bookingId: input.bookingId,
          amount: Number(booking.totalPrice),
          refundStatus: 'Processed',
          reason: input.reason,
        },
        connection,
      );
      await paymentModel.upsertPayment(
        {
          bookingId: input.bookingId,
          amount: Number(booking.totalPrice),
          paymentStatus: 'Refunded',
          paymentMethod: existingPayment.paymentMethod,
          transactionReference: existingPayment.transactionReference ?? `RF-${input.bookingId}-${Date.now()}`,
        },
        connection,
      );
      await bookingModel.updateBookingStatus(input.bookingId, 'Cancelled', connection);

      // Deduct points earned from this booking if it was already paid
      const loyalty = await loyaltyModel.findLoyaltyByCustomerId(booking.customerId, connection);
      const pointsToDeduct = calculateTripCoinsEarned(Number(booking.totalPrice), loyalty?.membershipLevel ?? 'Silver');
      const nextPoints = Math.max(0, (loyalty?.points ?? 0) - pointsToDeduct);
      await loyaltyModel.updateLoyalty(booking.customerId, nextPoints, calculateMembershipLevel(nextPoints), connection);
    });

    return getBooking(input.bookingId);
  } catch (err) {
    console.error('Error in cancelBooking:', err);
    throw err;
  }
}

export async function deleteBooking(bookingId: number) {
  await bookingModel.deleteBooking(bookingId);
}

export async function listPayments() {
  return paymentModel.listPayments();
}

export async function deletePayment(paymentId: number) {
  await paymentModel.deletePayment(paymentId);
}

export async function listRefunds() {
  return refundModel.listRefunds();
}

export async function updateInternalNotes(bookingId: number, notes: string) {
  await bookingModel.updateInternalNotes(bookingId, notes);
  return getBooking(bookingId);
}

export async function deleteRefund(refundId: number) {
  await refundModel.deleteRefund(refundId);
}
