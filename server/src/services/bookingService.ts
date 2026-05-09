import { withTransaction } from '../config/db.js';
import * as bookingModel from '../models/bookingModel.js';
import * as roomModel from '../models/roomModel.js';
import * as paymentModel from '../models/paymentModel.js';
import * as refundModel from '../models/refundModel.js';
import * as loyaltyModel from '../models/loyaltyModel.js';
import { ApiError } from '../utils/apiError.js';
import { calculateMembershipLevel, calculateNights, isRefundEligible } from '../utils/booking.js';

export async function createBooking(input: {
  customerId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
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

  const totalPrice = nights * Number(room.pricePerNight);

  const bookingId = await withTransaction(async (connection) => {
    return bookingModel.createBooking(
      {
        customerId: input.customerId,
        roomId: input.roomId,
        checkInDate: input.checkInDate,
        checkOutDate: input.checkOutDate,
        nights,
        totalPrice,
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

    const loyalty = await loyaltyModel.findLoyaltyByCustomerId(input.customerId);
    const nextPoints = (loyalty?.points ?? 0) + Math.floor(input.amount / 10);
    await loyaltyModel.updateLoyalty(input.customerId, nextPoints, calculateMembershipLevel(nextPoints));
  });

  return {
    booking: await getBooking(input.bookingId),
    payment: await paymentModel.getPaymentByBookingId(input.bookingId),
  };
}

export async function completeBooking(bookingId: number) {
  await bookingModel.updateBookingStatus(bookingId, 'Completed');
  return getBooking(bookingId);
}

export async function cancelBooking(input: { bookingId: number; customerId?: number; reason: string; force?: boolean }) {
  const booking = await getBooking(input.bookingId);

  if (input.customerId && booking.customerId !== input.customerId) {
    throw new ApiError(403, 'This booking does not belong to the authenticated customer.');
  }

  if (booking.bookingStatus === 'Cancelled') {
    throw new ApiError(400, 'Booking is already cancelled.');
  }

  if (!isRefundEligible(booking.checkInDate) && !input.force) {
    throw new ApiError(400, 'This booking is no longer eligible for a refund.');
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
  });

  return getBooking(input.bookingId);
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

export async function deleteRefund(refundId: number) {
  await refundModel.deleteRefund(refundId);
}
