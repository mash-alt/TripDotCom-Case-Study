import type { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { query } from '../config/db.js';

export interface RoomRow extends RowDataPacket {
  id: number;
  hotelId: number;
  hotelName?: string;
  name: string;
  roomType: string;
  description: string;
  bedType: string;
  sizeSqm: number;
  capacityAdults: number;
  capacityChildren: number;
  pricePerNight: number;
  totalInventory: number;
  imageUrl: string | null;
}

export async function listRooms(filters: { hotelId?: number }) {
  const params: unknown[] = [];
  let sql = `SELECT
      r.room_id AS id,
      r.hotel_id AS hotelId,
      h.name AS hotelName,
      r.name,
      r.room_type AS roomType,
      r.description,
      r.bed_type AS bedType,
      r.size_sqm AS sizeSqm,
      r.capacity_adults AS capacityAdults,
      r.capacity_children AS capacityChildren,
      r.price_per_night AS pricePerNight,
      r.total_inventory AS totalInventory,
      r.image_url AS imageUrl
    FROM rooms r
    INNER JOIN hotels h ON h.hotel_id = r.hotel_id`;

  if (filters.hotelId) {
    sql += ' WHERE r.hotel_id = ?';
    params.push(filters.hotelId);
  }

  sql += ' ORDER BY r.price_per_night ASC, r.room_id ASC';

  return query<RoomRow[]>(sql, params);
}

export async function getRoomById(roomId: number) {
  const rows = await query<RoomRow[]>(
    `SELECT
      r.room_id AS id,
      r.hotel_id AS hotelId,
      h.name AS hotelName,
      r.name,
      r.room_type AS roomType,
      r.description,
      r.bed_type AS bedType,
      r.size_sqm AS sizeSqm,
      r.capacity_adults AS capacityAdults,
      r.capacity_children AS capacityChildren,
      r.price_per_night AS pricePerNight,
      r.total_inventory AS totalInventory,
      r.image_url AS imageUrl
     FROM rooms r
     INNER JOIN hotels h ON h.hotel_id = r.hotel_id
     WHERE r.room_id = ?`,
    [roomId],
  );

  return rows[0] ?? null;
}

export async function getRoomAmenities(roomId: number) {
  const rows = await query<RowDataPacket[]>(
    `SELECT amenity_name AS amenityName
     FROM room_amenities
     WHERE room_id = ?
     ORDER BY amenity_name ASC`,
    [roomId],
  );

  return rows.map((row) => String(row.amenityName));
}

export async function createRoom(
  input: Omit<RoomRow, 'id' | 'hotelName'>,
  connection: PoolConnection,
) {
  const [result] = await connection.execute<ResultSetHeader>(
    `INSERT INTO rooms (
      hotel_id, name, room_type, description, bed_type, size_sqm,
      capacity_adults, capacity_children, price_per_night, total_inventory, image_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.hotelId,
      input.name,
      input.roomType,
      input.description,
      input.bedType,
      input.sizeSqm,
      input.capacityAdults,
      input.capacityChildren,
      input.pricePerNight,
      input.totalInventory,
      input.imageUrl,
    ],
  );

  return result.insertId;
}

export async function updateRoom(
  roomId: number,
  input: Omit<RoomRow, 'id' | 'hotelName'>,
) {
  await query<ResultSetHeader>(
    `UPDATE rooms
     SET hotel_id = ?, name = ?, room_type = ?, description = ?, bed_type = ?, size_sqm = ?,
         capacity_adults = ?, capacity_children = ?, price_per_night = ?, total_inventory = ?, image_url = ?
     WHERE room_id = ?`,
    [
      input.hotelId,
      input.name,
      input.roomType,
      input.description,
      input.bedType,
      input.sizeSqm,
      input.capacityAdults,
      input.capacityChildren,
      input.pricePerNight,
      input.totalInventory,
      input.imageUrl,
      roomId,
    ],
  );
}

export async function deleteRoom(roomId: number) {
  await query<ResultSetHeader>('DELETE FROM rooms WHERE room_id = ?', [roomId]);
}

export async function replaceRoomAmenities(roomId: number, amenities: string[], connection: PoolConnection) {
  await connection.execute<ResultSetHeader>('DELETE FROM room_amenities WHERE room_id = ?', [roomId]);

  for (const amenityName of amenities) {
    await connection.execute<ResultSetHeader>(
      `INSERT INTO room_amenities (room_id, amenity_name)
       VALUES (?, ?)`,
      [roomId, amenityName],
    );
  }
}
