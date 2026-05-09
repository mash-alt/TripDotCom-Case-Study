import type { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { query } from '../config/db.js';

export interface BookingRow extends RowDataPacket {
  bookingId: number;
  customerId: number;
  roomId: number;
  hotelId: number;
  hotelName: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  totalPrice: number;
  bookingStatus: 'PendingPayment' | 'Confirmed' | 'Cancelled' | 'Completed';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded' | null;
  refundStatus: 'Requested' | 'Approved' | 'Rejected' | 'Processed' | null;
  coinsRedeemed: number;
  discountApplied: number;
  createdAt: Date;
}

export async function findBookingById(bookingId: number) {
  const rows = await query<BookingRow[]>(
    `SELECT
      b.booking_id AS bookingId,
      b.customer_id AS customerId,
      b.room_id AS roomId,
      r.hotel_id AS hotelId,
      h.name AS hotelName,
      r.name AS roomName,
      DATE_FORMAT(b.check_in_date, '%Y-%m-%d') AS checkInDate,
      DATE_FORMAT(b.check_out_date, '%Y-%m-%d') AS checkOutDate,
      b.nights,
      b.total_price AS totalPrice,
      b.booking_status AS bookingStatus,
      p.payment_status AS paymentStatus,
      rf.refund_status AS refundStatus,
      b.coins_redeemed AS coinsRedeemed,
      b.discount_applied AS discountApplied,
      b.created_at AS createdAt
    FROM bookings b
    INNER JOIN rooms r ON r.room_id = b.room_id
    INNER JOIN hotels h ON h.hotel_id = r.hotel_id
    LEFT JOIN payments p ON p.booking_id = b.booking_id
    LEFT JOIN refunds rf ON rf.booking_id = b.booking_id
    WHERE b.booking_id = ?`,
    [bookingId],
  );

  return rows[0] ?? null;
}

export async function listBookingsForCustomer(customerId: number) {
  return query<BookingRow[]>(
    `SELECT
      b.booking_id AS bookingId,
      b.customer_id AS customerId,
      b.room_id AS roomId,
      r.hotel_id AS hotelId,
      h.name AS hotelName,
      r.name AS roomName,
      DATE_FORMAT(b.check_in_date, '%Y-%m-%d') AS checkInDate,
      DATE_FORMAT(b.check_out_date, '%Y-%m-%d') AS checkOutDate,
      b.nights,
      b.total_price AS totalPrice,
      b.booking_status AS bookingStatus,
      p.payment_status AS paymentStatus,
      rf.refund_status AS refundStatus,
      b.coins_redeemed AS coinsRedeemed,
      b.discount_applied AS discountApplied,
      b.created_at AS createdAt
    FROM bookings b
    INNER JOIN rooms r ON r.room_id = b.room_id
    INNER JOIN hotels h ON h.hotel_id = r.hotel_id
    LEFT JOIN payments p ON p.booking_id = b.booking_id
    LEFT JOIN refunds rf ON rf.booking_id = b.booking_id
    WHERE b.customer_id = ?
    ORDER BY b.created_at DESC`,
    [customerId],
  );
}

export async function listAllBookings(adminId?: number) {
  const params: unknown[] = [];
  let sql = `SELECT
      b.booking_id AS bookingId,
      b.customer_id AS customerId,
      b.room_id AS roomId,
      r.hotel_id AS hotelId,
      h.name AS hotelName,
      r.name AS roomName,
      DATE_FORMAT(b.check_in_date, '%Y-%m-%d') AS checkInDate,
      DATE_FORMAT(b.check_out_date, '%Y-%m-%d') AS checkOutDate,
      b.nights,
      b.total_price AS totalPrice,
      b.booking_status AS bookingStatus,
      p.payment_status AS paymentStatus,
      rf.refund_status AS refundStatus,
      b.coins_redeemed AS coinsRedeemed,
      b.discount_applied AS discountApplied,
      b.created_at AS createdAt
    FROM bookings b
    INNER JOIN rooms r ON r.room_id = b.room_id
    INNER JOIN hotels h ON h.hotel_id = r.hotel_id
    LEFT JOIN payments p ON p.booking_id = b.booking_id
    LEFT JOIN refunds rf ON rf.booking_id = b.booking_id`;

  if (adminId) {
    sql += ' WHERE h.admin_id = ?';
    params.push(adminId);
  }

  sql += ' ORDER BY b.created_at DESC';

  return query<BookingRow[]>(sql, params);
}

export async function findOverlappingBooking(roomId: number, checkInDate: string, checkOutDate: string) {
  const rows = await query<RowDataPacket[]>(
    `SELECT booking_id AS bookingId
     FROM bookings
     WHERE room_id = ?
       AND booking_status IN ('PendingPayment', 'Confirmed', 'Completed')
       AND check_in_date < ?
       AND check_out_date > ?
     LIMIT 1`,
    [roomId, checkOutDate, checkInDate],
  );

  return rows[0] ?? null;
}

export async function createBooking(
  input: {
    customerId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    totalPrice: number;
  },
  connection: PoolConnection,
) {
  const [result] = await connection.execute<ResultSetHeader>(
    `INSERT INTO bookings (
      customer_id, room_id, check_in_date, check_out_date, nights, total_price, booking_status, coins_redeemed, discount_applied
    ) VALUES (?, ?, ?, ?, ?, ?, 'PendingPayment', ?, ?)`,
    [
      input.customerId,
      input.roomId,
      input.checkInDate,
      input.checkOutDate,
      input.nights,
      input.totalPrice,
      input.coinsRedeemed ?? 0,
      input.discountApplied ?? 0,
    ],
  );

  return result.insertId;
}

export async function updateBookingStatus(
  bookingId: number,
  status: 'PendingPayment' | 'Confirmed' | 'Cancelled' | 'Completed',
  connection?: PoolConnection,
) {
  if (connection) {
    await connection.execute<ResultSetHeader>(
      `UPDATE bookings
       SET booking_status = ?, cancelled_at = CASE WHEN ? = 'Cancelled' THEN NOW() ELSE cancelled_at END
       WHERE booking_id = ?`,
      [status, status, bookingId],
    );
    return;
  }

  await query<ResultSetHeader>(
    `UPDATE bookings
     SET booking_status = ?, cancelled_at = CASE WHEN ? = 'Cancelled' THEN NOW() ELSE cancelled_at END
     WHERE booking_id = ?`,
    [status, status, bookingId],
  );
}

export async function deleteBooking(bookingId: number) {
  await query<ResultSetHeader>('DELETE FROM bookings WHERE booking_id = ?', [bookingId]);
}
