import type { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { query } from '../config/db.js';

export interface CustomerRow extends RowDataPacket {
  customerId: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  passwordHash: string;
  loyaltyPoints: number;
  membershipLevel: string;
  createdAt: Date;
}

export async function findCustomerByEmail(email: string, connection?: PoolConnection) {
  if (connection) {
    const [rows] = await connection.execute<CustomerRow[]>(
      `SELECT
        customer_id AS customerId,
        full_name AS fullName,
        email,
        phone_number AS phoneNumber,
        password_hash AS passwordHash,
        created_at AS createdAt
      FROM customers
      WHERE email = ?`,
      [email],
    );
    return rows[0] ?? null;
  }

  const rows = await query<CustomerRow[]>(
    `SELECT
      customer_id AS customerId,
      full_name AS fullName,
      email,
      phone_number AS phoneNumber,
      password_hash AS passwordHash,
      created_at AS createdAt
    FROM customers
    WHERE email = ?`,
    [email],
  );

  return rows[0] ?? null;
}

export async function findCustomerById(customerId: number) {
  const rows = await query<CustomerRow[]>(
    `SELECT
      customer_id AS customerId,
      full_name AS fullName,
      email,
      phone_number AS phoneNumber,
      password_hash AS passwordHash,
      created_at AS createdAt
    FROM customers
    WHERE customer_id = ?`,
    [customerId],
  );

  return rows[0] ?? null;
}

export async function listCustomers() {
  return query<CustomerRow[]>(
    `SELECT
      c.customer_id AS customerId,
      c.full_name AS fullName,
      c.email,
      c.phone_number AS phoneNumber,
      c.password_hash AS passwordHash,
      l.points AS loyaltyPoints,
      l.membership_level AS membershipLevel,
      c.created_at AS createdAt
    FROM customers c
    LEFT JOIN loyalty l ON l.customer_id = c.customer_id
    ORDER BY c.created_at DESC`,
  );
}

export async function createCustomer(
  input: { fullName: string; email: string; phoneNumber?: string | null; passwordHash: string },
  connection: PoolConnection,
) {
  const [result] = await connection.execute<ResultSetHeader>(
    `INSERT INTO customers (full_name, email, phone_number, password_hash)
     VALUES (?, ?, ?, ?)`,
    [input.fullName, input.email, input.phoneNumber ?? null, input.passwordHash],
  );

  return result.insertId;
}

export async function updateCustomer(customerId: number, input: { fullName: string; phoneNumber?: string | null }) {
  await query<ResultSetHeader>(
    `UPDATE customers
     SET full_name = ?, phone_number = ?
     WHERE customer_id = ?`,
    [input.fullName, input.phoneNumber ?? null, customerId],
  );
}

export async function deleteCustomer(customerId: number) {
  await query<ResultSetHeader>('DELETE FROM customers WHERE customer_id = ?', [customerId]);
}
