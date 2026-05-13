import type { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import type { UserRole } from '../types/domain.js';
import { query } from '../config/db.js';

export interface SupportRow extends RowDataPacket {
  supportId: number;
  customerId: number;
  bookingId: number | null;
  resolverId: number | null;
  resolverType: UserRole | null;
  subject: string;
  message: string;
  status: 'Open' | 'InProgress' | 'Resolved';
  resolutionNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function listSupportTickets(filters: { customerId?: number; ownerId?: number }) {
  const params: unknown[] = [];
  let sql = `SELECT
      st.support_id AS supportId,
      st.customer_id AS customerId,
      st.booking_id AS bookingId,
      st.resolver_id AS resolverId,
      st.resolver_type AS resolverType,
      st.subject,
      st.message,
      st.ticket_status AS status,
      st.resolution_notes AS resolutionNotes,
      st.created_at AS createdAt,
      st.updated_at AS updatedAt
    FROM support_tickets st
    LEFT JOIN bookings b ON b.booking_id = st.booking_id
    LEFT JOIN rooms r ON r.room_id = b.room_id
    LEFT JOIN hotels h ON h.hotel_id = r.hotel_id`;

  const conditions: string[] = [];

  if (filters.customerId) {
    conditions.push('st.customer_id = ?');
    params.push(filters.customerId);
  }

  if (filters.ownerId) {
    conditions.push('h.admin_id = ?');
    params.push(filters.ownerId);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY st.updated_at DESC';

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
    resolverId: number;
    resolverType: UserRole;
    resolutionNotes?: string | null;
  },
) {
  await query<ResultSetHeader>(
    `UPDATE support_tickets
     SET ticket_status = ?, resolver_id = ?, resolver_type = ?, resolution_notes = ?, updated_at = NOW()
     WHERE support_id = ?`,
    [input.status, input.resolverId, input.resolverType, input.resolutionNotes ?? null, supportId],
  );
}

export async function deleteSupportTicket(supportId: number) {
  await query<ResultSetHeader>('DELETE FROM support_tickets WHERE support_id = ?', [supportId]);
}
