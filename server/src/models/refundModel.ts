import type { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { query } from '../config/db.js';

export interface RefundRow extends RowDataPacket {
  refundId: number;
  bookingId: number;
  amount: number;
  refundStatus: 'Requested' | 'Approved' | 'Rejected' | 'Processed';
  reason: string;
  requestedAt: Date;
  processedAt: Date | null;
}

export async function getRefundByBookingId(bookingId: number) {
  const rows = await query<RefundRow[]>(
    `SELECT
      refund_id AS refundId,
      booking_id AS bookingId,
      amount,
      refund_status AS refundStatus,
      reason,
      requested_at AS requestedAt,
      processed_at AS processedAt
    FROM refunds
    WHERE booking_id = ?`,
    [bookingId],
  );

  return rows[0] ?? null;
}

export async function createRefund(
  input: {
    bookingId: number;
    amount: number;
    refundStatus: RefundRow['refundStatus'];
    reason: string;
  },
  connection: PoolConnection,
) {
  await connection.execute<ResultSetHeader>(
    `INSERT INTO refunds (booking_id, amount, refund_status, reason, requested_at, processed_at)
     VALUES (?, ?, ?, ?, NOW(), CASE WHEN ? = 'Processed' THEN NOW() ELSE NULL END)
     ON DUPLICATE KEY UPDATE
       amount = VALUES(amount),
       refund_status = VALUES(refund_status),
       reason = VALUES(reason),
       processed_at = VALUES(processed_at)`,
    [input.bookingId, input.amount, input.refundStatus, input.reason, input.refundStatus],
  );
}

export async function listRefunds() {
  return query<RefundRow[]>(
    `SELECT
      refund_id AS refundId,
      booking_id AS bookingId,
      amount,
      refund_status AS refundStatus,
      reason,
      requested_at AS requestedAt,
      processed_at AS processedAt
    FROM refunds
    ORDER BY refund_id DESC`,
  );
}

export async function deleteRefund(refundId: number) {
  await query<ResultSetHeader>('DELETE FROM refunds WHERE refund_id = ?', [refundId]);
}
