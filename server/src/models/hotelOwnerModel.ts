import type { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { query } from '../config/db.js';

export interface HotelOwnerRow extends RowDataPacket {
  ownerId: number;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export async function findHotelOwnerByEmail(email: string, connection?: PoolConnection) {
  if (connection) {
    const [rows] = await connection.execute<HotelOwnerRow[]>(
      `SELECT
        owner_id AS ownerId,
        full_name AS fullName,
        email,
        password_hash AS passwordHash,
        created_at AS createdAt
      FROM hotel_owners
      WHERE email = ?`,
      [email],
    );
    return rows[0] ?? null;
  }

  const rows = await query<HotelOwnerRow[]>(
    `SELECT
      owner_id AS ownerId,
      full_name AS fullName,
      email,
      password_hash AS passwordHash,
      created_at AS createdAt
    FROM hotel_owners
    WHERE email = ?`,
    [email],
  );

  return rows[0] ?? null;
}

export async function findHotelOwnerById(ownerId: number) {
  const rows = await query<HotelOwnerRow[]>(
    `SELECT
      owner_id AS ownerId,
      full_name AS fullName,
      email,
      password_hash AS passwordHash,
      created_at AS createdAt
    FROM hotel_owners
    WHERE owner_id = ?`,
    [ownerId],
  );

  return rows[0] ?? null;
}

export async function createHotelOwner(
  input: { fullName: string; email: string; passwordHash: string },
  connection?: PoolConnection,
) {
  if (connection) {
    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO hotel_owners (full_name, email, password_hash)
       VALUES (?, ?, ?)`,
      [input.fullName, input.email, input.passwordHash],
    );
    return result.insertId;
  }

  const result = await query<ResultSetHeader>(
    `INSERT INTO hotel_owners (full_name, email, password_hash)
     VALUES (?, ?, ?)`,
    [input.fullName, input.email, input.passwordHash],
  );

  return result.insertId;
}
