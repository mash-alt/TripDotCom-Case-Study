import type { PoolConnection, RowDataPacket } from 'mysql2/promise';
import { query } from '../config/db.js';

export interface HotelStaffRow extends RowDataPacket {
  staffId: number;
  ownerId: number;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export async function findHotelStaffByEmail(email: string, connection?: PoolConnection) {
  if (connection) {
    const [rows] = await connection.execute<HotelStaffRow[]>(
      `SELECT
        staff_id AS staffId,
        owner_id AS ownerId,
        full_name AS fullName,
        email,
        password_hash AS passwordHash,
        created_at AS createdAt
      FROM hotel_staff
      WHERE email = ?`,
      [email],
    );
    return rows[0] ?? null;
  }

  const rows = await query<HotelStaffRow[]>(
    `SELECT
      staff_id AS staffId,
      owner_id AS ownerId,
      full_name AS fullName,
      email,
      password_hash AS passwordHash,
      created_at AS createdAt
    FROM hotel_staff
    WHERE email = ?`,
    [email],
  );

  return rows[0] ?? null;
}

export async function findHotelStaffById(staffId: number) {
  const rows = await query<HotelStaffRow[]>(
    `SELECT
      staff_id AS staffId,
      owner_id AS ownerId,
      full_name AS fullName,
      email,
      password_hash AS passwordHash,
      created_at AS createdAt
    FROM hotel_staff
    WHERE staff_id = ?`,
    [staffId],
  );

  return rows[0] ?? null;
}
