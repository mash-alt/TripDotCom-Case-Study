import type { PoolConnection, RowDataPacket } from 'mysql2/promise';
import { query } from '../config/db.js';

export interface AdminRow extends RowDataPacket {
  adminId: number;
  fullName: string;
  email: string;
  passwordHash: string;
}

export async function findAdminByEmail(email: string, connection?: PoolConnection) {
  if (connection) {
    const [rows] = await connection.execute<AdminRow[]>(
      `SELECT
        admin_id AS adminId,
        full_name AS fullName,
        email,
        password_hash AS passwordHash
      FROM admins
      WHERE email = ?`,
      [email],
    );
    return rows[0] ?? null;
  }

  const rows = await query<AdminRow[]>(
    `SELECT
      admin_id AS adminId,
      full_name AS fullName,
      email,
      password_hash AS passwordHash
    FROM admins
    WHERE email = ?`,
    [email],
  );

  return rows[0] ?? null;
}

export async function findAdminById(adminId: number) {
  const rows = await query<AdminRow[]>(
    `SELECT
      admin_id AS adminId,
      full_name AS fullName,
      email,
      password_hash AS passwordHash
    FROM admins
    WHERE admin_id = ?`,
    [adminId],
  );

  return rows[0] ?? null;
}
