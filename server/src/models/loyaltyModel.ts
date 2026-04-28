import type { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { query } from '../config/db.js';

export interface LoyaltyRow extends RowDataPacket {
  loyaltyId: number;
  customerId: number;
  points: number;
  membershipLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

export async function createLoyalty(customerId: number, connection: PoolConnection) {
  await connection.execute<ResultSetHeader>(
    `INSERT INTO loyalty (customer_id, points, membership_level)
     VALUES (?, 0, 'Bronze')`,
    [customerId],
  );
}

export async function findLoyaltyByCustomerId(customerId: number) {
  const rows = await query<LoyaltyRow[]>(
    `SELECT
      loyalty_id AS loyaltyId,
      customer_id AS customerId,
      points,
      membership_level AS membershipLevel
    FROM loyalty
    WHERE customer_id = ?`,
    [customerId],
  );

  return rows[0] ?? null;
}

export async function updateLoyalty(customerId: number, points: number, membershipLevel: LoyaltyRow['membershipLevel']) {
  await query<ResultSetHeader>(
    `UPDATE loyalty
     SET points = ?, membership_level = ?
     WHERE customer_id = ?`,
    [points, membershipLevel, customerId],
  );
}
