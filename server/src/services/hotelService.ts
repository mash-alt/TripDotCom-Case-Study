import { withTransaction } from '../config/db.js';
import * as hotelModel from '../models/hotelModel.js';
import * as roomModel from '../models/roomModel.js';
import { ApiError } from '../utils/apiError.js';

async function enrichHotelSummary(row: hotelModel.HotelListRow) {
  const amenities = await hotelModel.getHotelAmenities(row.id);
  return {
    id: row.id,
    adminId: row.adminId,
    name: row.name,
    city: row.city,
    country: row.country,
    address: row.address,
    location: `${row.city}, ${row.country}`,
    description: row.description,
    stars: row.stars,
    rating: Number(row.rating),
    reviewsCount: row.reviewsCount,
    basePrice: Number(row.basePrice ?? 0),
    heroImage: row.heroImage,
    amenities: amenities.map((item) => item.amenityName),
  };
}

export async function listHotels(filters: { search?: string; city?: string; maxPrice?: number; stars?: number }) {
  const hotels = await hotelModel.listHotels(filters);
  return Promise.all(hotels.map((hotel) => enrichHotelSummary(hotel)));
}

export async function getHotel(hotelId: number) {
  const hotel = await hotelModel.getHotelById(hotelId);

  if (!hotel) {
    throw new ApiError(404, 'Hotel not found.');
  }

  const [images, amenities, rooms] = await Promise.all([
    hotelModel.getHotelImages(hotelId),
    hotelModel.getHotelAmenities(hotelId),
    roomModel.listRooms({ hotelId }),
  ]);

  const enrichedRooms = await Promise.all(
    rooms.map(async (room) => ({
      id: room.id,
      hotelId: room.hotelId,
      name: room.name,
      roomType: room.roomType,
      description: room.description,
      bedType: room.bedType,
      sizeSqm: room.sizeSqm,
      capacityAdults: room.capacityAdults,
      capacityChildren: room.capacityChildren,
      pricePerNight: Number(room.pricePerNight),
      totalInventory: room.totalInventory,
      imageUrl: room.imageUrl,
      amenities: await roomModel.getRoomAmenities(room.id),
    })),
  );

  return {
    id: hotel.id,
    adminId: hotel.adminId,
    name: hotel.name,
    city: hotel.city,
    country: hotel.country,
    address: hotel.address,
    location: `${hotel.city}, ${hotel.country}`,
    description: hotel.description,
    stars: hotel.stars,
    rating: Number(hotel.rating),
    reviewsCount: hotel.reviewsCount,
    basePrice: Number(hotel.basePrice ?? 0),
    heroImage: hotel.heroImage,
    images: images.map((image) => image.imageUrl),
    amenities: amenities.map((item) => item.amenityName),
    rooms: enrichedRooms,
  };
}

export async function createHotel(input: {
  adminId: number;
  name: string;
  city: string;
  country: string;
  address: string;
  description: string;
  stars: number;
  rating?: number;
  reviewsCount?: number;
  images: string[];
  amenities: string[];
}) {
  const hotelId = await withTransaction(async (connection) => {
    const newHotelId = await hotelModel.createHotel(
      {
        adminId: input.adminId,
        name: input.name,
        city: input.city,
        country: input.country,
        address: input.address,
        description: input.description,
        stars: input.stars,
        rating: input.rating ?? 0,
        reviewsCount: input.reviewsCount ?? 0,
      },
      connection,
    );

    await hotelModel.replaceHotelImages(newHotelId, input.images, connection);
    await hotelModel.replaceHotelAmenities(newHotelId, input.amenities, connection);
    return newHotelId;
  });

  return getHotel(hotelId);
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
    rating?: number;
    reviewsCount?: number;
    images: string[];
    amenities: string[];
  },
) {
  const existingHotel = await hotelModel.getHotelById(hotelId);

  if (!existingHotel) {
    throw new ApiError(404, 'Hotel not found.');
  }

  await withTransaction(async (connection) => {
    await hotelModel.updateHotel(hotelId, {
      name: input.name,
      city: input.city,
      country: input.country,
      address: input.address,
      description: input.description,
      stars: input.stars,
      rating: input.rating ?? 0,
      reviewsCount: input.reviewsCount ?? 0,
    });
    await hotelModel.replaceHotelImages(hotelId, input.images, connection);
    await hotelModel.replaceHotelAmenities(hotelId, input.amenities, connection);
  });

  return getHotel(hotelId);
}

export async function deleteHotel(hotelId: number) {
  await hotelModel.deleteHotel(hotelId);
}
