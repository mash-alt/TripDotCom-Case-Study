import type { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { query } from '../config/db.js';

export interface LoyaltyRow extends RowDataPacket {
  loyaltyId: number;
  customerId: number;
  points: number;
  membershipLevel: 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Diamond+' | 'Black Diamond';
}

export async function createLoyalty(customerId: number, connection: PoolConnection) {
  await connection.execute<ResultSetHeader>(
    `INSERT INTO loyalty (customer_id, points, membership_level)
     VALUES (?, 0, 'Silver')`,
    [customerId],
  );
}

export async function findLoyaltyByCustomerId(customerId: number, connection?: PoolConnection) {
  const sql = `SELECT
      loyalty_id AS loyaltyId,
      customer_id AS customerId,
      points,
      membership_level AS membershipLevel
    FROM loyalty
    WHERE customer_id = ?`;
  
  if (connection) {
    const [rows] = await connection.execute<LoyaltyRow[]>(sql, [customerId]);
    return rows[0] ?? null;
  }

  const rows = await query<LoyaltyRow[]>(sql, [customerId]);
  return rows[0] ?? null;
}

export async function updateLoyalty(customerId: number, points: number, membershipLevel: LoyaltyRow['membershipLevel'], connection?: PoolConnection) {
  const sql = `UPDATE loyalty
     SET points = ?, membership_level = ?
     WHERE customer_id = ?`;
  const params = [points, membershipLevel, customerId];

  if (connection) {
    await connection.execute<ResultSetHeader>(sql, params);
  } else {
    await query<ResultSetHeader>(sql, params);
  }
}
