import type { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { query } from '../config/db.js';

export interface PaymentRow extends RowDataPacket {
  paymentId: number;
  bookingId: number;
  amount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  paymentMethod: string;
  transactionReference: string | null;
  paidAt: Date | null;
}

export async function getPaymentByBookingId(bookingId: number) {
  const rows = await query<PaymentRow[]>(
    `SELECT
      payment_id AS paymentId,
      booking_id AS bookingId,
      amount,
      payment_status AS paymentStatus,
      payment_method AS paymentMethod,
      transaction_reference AS transactionReference,
      paid_at AS paidAt
    FROM payments
    WHERE booking_id = ?`,
    [bookingId],
  );

  return rows[0] ?? null;
}

export async function upsertPayment(
  input: {
    bookingId: number;
    amount: number;
    paymentStatus: PaymentRow['paymentStatus'];
    paymentMethod: string;
    transactionReference: string;
  },
  connection: PoolConnection,
) {
  await connection.execute<ResultSetHeader>(
    `INSERT INTO payments (booking_id, amount, payment_status, payment_method, transaction_reference, paid_at)
     VALUES (?, ?, ?, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE
       amount = VALUES(amount),
       payment_status = VALUES(payment_status),
       payment_method = VALUES(payment_method),
       transaction_reference = VALUES(transaction_reference),
       paid_at = VALUES(paid_at)`,
    [
      input.bookingId,
      input.amount,
      input.paymentStatus,
      input.paymentMethod,
      input.transactionReference,
    ],
  );
}

export async function listPayments() {
  return query<PaymentRow[]>(
    `SELECT
      payment_id AS paymentId,
      booking_id AS bookingId,
      amount,
      payment_status AS paymentStatus,
      payment_method AS paymentMethod,
      transaction_reference AS transactionReference,
      paid_at AS paidAt
    FROM payments
    ORDER BY payment_id DESC`,
  );
}

export async function deletePayment(paymentId: number) {
  await query<ResultSetHeader>('DELETE FROM payments WHERE payment_id = ?', [paymentId]);
}
