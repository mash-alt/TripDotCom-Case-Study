import type { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
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

export async function createHotelStaff(
  input: { ownerId: number; fullName: string; email: string; passwordHash: string },
  connection?: PoolConnection,
) {
  if (connection) {
    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO hotel_staff (owner_id, full_name, email, password_hash)
       VALUES (?, ?, ?, ?)`,
      [input.ownerId, input.fullName, input.email, input.passwordHash],
    );
    return result.insertId;
  }

  const result = await query<ResultSetHeader>(
    `INSERT INTO hotel_staff (owner_id, full_name, email, password_hash)
     VALUES (?, ?, ?, ?)`,
    [input.ownerId, input.fullName, input.email, input.passwordHash],
  );

  return result.insertId;
}
