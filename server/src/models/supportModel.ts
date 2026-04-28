import type { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { query } from '../config/db.js';

export interface SupportRow extends RowDataPacket {
  supportId: number;
  customerId: number;
  bookingId: number | null;
  adminId: number | null;
  subject: string;
  message: string;
  status: 'Open' | 'InProgress' | 'Resolved';
  resolutionNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function listSupportTickets(filters: { customerId?: number }) {
  const params: unknown[] = [];
  let sql = `SELECT
      support_id AS supportId,
      customer_id AS customerId,
      booking_id AS bookingId,
      admin_id AS adminId,
      subject,
      message,
      ticket_status AS status,
      resolution_notes AS resolutionNotes,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM support_tickets`;

  if (filters.customerId) {
    sql += ' WHERE customer_id = ?';
    params.push(filters.customerId);
  }

  sql += ' ORDER BY updated_at DESC';

  return query<SupportRow[]>(sql, params);
}

export async function createSupportTicket(
  input: { customerId: number; bookingId?: number | null; subject: string; message: string },
  connection?: PoolConnection,
) {
  if (connection) {
    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO support_tickets (customer_id, booking_id, subject, message, ticket_status)
       VALUES (?, ?, ?, ?, 'Open')`,
      [input.customerId, input.bookingId ?? null, input.subject, input.message],
    );
    return result.insertId;
  }

  const result = await query<ResultSetHeader>(
    `INSERT INTO support_tickets (customer_id, booking_id, subject, message, ticket_status)
     VALUES (?, ?, ?, ?, 'Open')`,
    [input.customerId, input.bookingId ?? null, input.subject, input.message],
  );

  return result.insertId;
}

export async function updateSupportTicket(
  supportId: number,
  input: {
    status: SupportRow['status'];
    adminId: number;
    resolutionNotes?: string | null;
  },
) {
  await query<ResultSetHeader>(
    `UPDATE support_tickets
     SET ticket_status = ?, admin_id = ?, resolution_notes = ?, updated_at = NOW()
     WHERE support_id = ?`,
    [input.status, input.adminId, input.resolutionNotes ?? null, supportId],
  );
}

export async function deleteSupportTicket(supportId: number) {
  await query<ResultSetHeader>('DELETE FROM support_tickets WHERE support_id = ?', [supportId]);
}
