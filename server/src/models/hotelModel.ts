import type { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { query } from '../config/db.js';

export interface HotelListRow extends RowDataPacket {
  id: number;
  ownerId: number;
  name: string;
  city: string;
  country: string;
  address: string;
  description: string;
  stars: number;
  rating: number;
  reviewsCount: number;
  basePrice: number;
  heroImage: string | null;
}

export interface HotelDetailRow extends HotelListRow {
  createdAt: Date;
}

export interface HotelImageRow extends RowDataPacket {
  imageUrl: string;
}

export interface AmenityRow extends RowDataPacket {
  amenityName: string;
}

export async function listHotels(filters: { search?: string; city?: string; maxPrice?: number; stars?: number; ownerId?: number }) {
  const conditions = ['1 = 1'];
  const params: Record<string, unknown> = {};

  if (filters.search) {
    conditions.push('(h.name LIKE :search OR h.city LIKE :search OR h.country LIKE :search)');
    params.search = `%${filters.search}%`;
  }

  if (filters.city) {
    conditions.push('h.city = :city');
    params.city = filters.city;
  }

  if (filters.stars) {
    conditions.push('h.star_rating >= :stars');
    params.stars = filters.stars;
  }

  if (filters.maxPrice) {
    conditions.push('r.price_per_night <= :maxPrice');
    params.maxPrice = filters.maxPrice;
  }

  if (filters.ownerId) {
    conditions.push('h.admin_id = :ownerId');
    params.ownerId = filters.ownerId;
  }

  return query<HotelListRow[]>(
    `SELECT
      h.hotel_id AS id,
      h.admin_id AS ownerId,
      h.name,
      h.city,
      h.country,
      h.address,
      h.description,
      h.star_rating AS stars,
      h.review_score AS rating,
      h.reviews_count AS reviewsCount,
      MIN(r.price_per_night) AS basePrice,
      (
        SELECT image_url
        FROM hotel_images hi
        WHERE hi.hotel_id = h.hotel_id
        ORDER BY hi.sort_order ASC, hi.image_id ASC
        LIMIT 1
      ) AS heroImage
    FROM hotels h
    LEFT JOIN rooms r ON r.hotel_id = h.hotel_id
    WHERE ${conditions.join(' AND ')}
    GROUP BY h.hotel_id
    ORDER BY h.review_score DESC, h.name ASC`,
    params,
  );
}

export async function getHotelById(hotelId: number) {
  const rows = await query<HotelDetailRow[]>(
    `SELECT
      h.hotel_id AS id,
      h.admin_id AS ownerId,
      h.name,
      h.city,
      h.country,
      h.address,
      h.description,
      h.star_rating AS stars,
      h.review_score AS rating,
      h.reviews_count AS reviewsCount,
      COALESCE(MIN(r.price_per_night), 0) AS basePrice,
      (
        SELECT image_url
        FROM hotel_images hi
        WHERE hi.hotel_id = h.hotel_id
        ORDER BY hi.sort_order ASC, hi.image_id ASC
        LIMIT 1
      ) AS heroImage,
      h.created_at AS createdAt
    FROM hotels h
    LEFT JOIN rooms r ON r.hotel_id = h.hotel_id
    WHERE h.hotel_id = ?
    GROUP BY h.hotel_id`,
    [hotelId],
  );

  return rows[0] ?? null;
}

export async function getHotelImages(hotelId: number) {
  return query<HotelImageRow[]>(
    `SELECT image_url AS imageUrl
     FROM hotel_images
     WHERE hotel_id = ?
     ORDER BY sort_order ASC, image_id ASC`,
    [hotelId],
  );
}

export async function getHotelAmenities(hotelId: number) {
  return query<AmenityRow[]>(
    `SELECT amenity_name AS amenityName
     FROM hotel_amenities
     WHERE hotel_id = ?
     ORDER BY amenity_name ASC`,
    [hotelId],
  );
}

export async function createHotel(
  input: {
    ownerId: number;
    name: string;
    city: string;
    country: string;
    address: string;
    description: string;
    stars: number;
    rating: number;
    reviewsCount: number;
  },
  connection: PoolConnection,
) {
  const [result] = await connection.execute<ResultSetHeader>(
    `INSERT INTO hotels (admin_id, name, city, country, address, description, star_rating, review_score, reviews_count)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.ownerId,
      input.name,
      input.city,
      input.country,
      input.address,
      input.description,
      input.stars,
      input.rating,
      input.reviewsCount,
    ],
  );

  return result.insertId;
}

export async function updateHotel(
  hotelId: number,
  input: {
    name: string;
    city: string;
    country: string;
    address: string;
    description: string;
    stars: number;
    rating: number;
    reviewsCount: number;
  },
) {
  await query<ResultSetHeader>(
    `UPDATE hotels
     SET name = ?, city = ?, country = ?, address = ?, description = ?, star_rating = ?, review_score = ?, reviews_count = ?
     WHERE hotel_id = ?`,
    [
      input.name,
      input.city,
      input.country,
      input.address,
      input.description,
      input.stars,
      input.rating,
      input.reviewsCount,
      hotelId,
    ],
  );
}

export async function deleteHotel(hotelId: number) {
  await query<ResultSetHeader>('DELETE FROM hotels WHERE hotel_id = ?', [hotelId]);
}

export async function replaceHotelImages(hotelId: number, images: string[], connection: PoolConnection) {
  await connection.execute<ResultSetHeader>('DELETE FROM hotel_images WHERE hotel_id = ?', [hotelId]);

  for (const [index, imageUrl] of images.entries()) {
    await connection.execute<ResultSetHeader>(
      `INSERT INTO hotel_images (hotel_id, image_url, sort_order)
       VALUES (?, ?, ?)`,
      [hotelId, imageUrl, index + 1],
    );
  }
}

export async function replaceHotelAmenities(hotelId: number, amenities: string[], connection: PoolConnection) {
  await connection.execute<ResultSetHeader>('DELETE FROM hotel_amenities WHERE hotel_id = ?', [hotelId]);

  for (const amenityName of amenities) {
    await connection.execute<ResultSetHeader>(
      `INSERT INTO hotel_amenities (hotel_id, amenity_name)
       VALUES (?, ?)`,
      [hotelId, amenityName],
    );
  }
}
