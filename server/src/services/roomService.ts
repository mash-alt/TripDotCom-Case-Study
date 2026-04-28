import { withTransaction } from '../config/db.js';
import * as roomModel from '../models/roomModel.js';
import { ApiError } from '../utils/apiError.js';

async function enrichRoom(room: roomModel.RoomRow) {
  return {
    id: room.id,
    hotelId: room.hotelId,
    hotelName: room.hotelName,
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
  };
}

export async function listRooms(filters: { hotelId?: number }) {
  const rooms = await roomModel.listRooms(filters);
  return Promise.all(rooms.map((room) => enrichRoom(room)));
}

export async function getRoom(roomId: number) {
  const room = await roomModel.getRoomById(roomId);

  if (!room) {
    throw new ApiError(404, 'Room not found.');
  }

  return enrichRoom(room);
}

export async function createRoom(input: {
  hotelId: number;
  name: string;
  roomType: string;
  description: string;
  bedType: string;
  sizeSqm: number;
  capacityAdults: number;
  capacityChildren: number;
  pricePerNight: number;
  totalInventory: number;
  imageUrl?: string | null;
  amenities: string[];
}) {
  const roomId = await withTransaction(async (connection) => {
    const newRoomId = await roomModel.createRoom(
      {
        hotelId: input.hotelId,
        name: input.name,
        roomType: input.roomType,
        description: input.description,
        bedType: input.bedType,
        sizeSqm: input.sizeSqm,
        capacityAdults: input.capacityAdults,
        capacityChildren: input.capacityChildren,
        pricePerNight: input.pricePerNight,
        totalInventory: input.totalInventory,
        imageUrl: input.imageUrl ?? null,
      },
      connection,
    );

    await roomModel.replaceRoomAmenities(newRoomId, input.amenities, connection);
    return newRoomId;
  });

  return getRoom(roomId);
}

export async function updateRoom(
  roomId: number,
  input: {
    hotelId: number;
    name: string;
    roomType: string;
    description: string;
    bedType: string;
    sizeSqm: number;
    capacityAdults: number;
    capacityChildren: number;
    pricePerNight: number;
    totalInventory: number;
    imageUrl?: string | null;
    amenities: string[];
  },
) {
  const existingRoom = await roomModel.getRoomById(roomId);

  if (!existingRoom) {
    throw new ApiError(404, 'Room not found.');
  }

  await withTransaction(async (connection) => {
    await roomModel.updateRoom(roomId, {
      hotelId: input.hotelId,
      name: input.name,
      roomType: input.roomType,
      description: input.description,
      bedType: input.bedType,
      sizeSqm: input.sizeSqm,
      capacityAdults: input.capacityAdults,
      capacityChildren: input.capacityChildren,
      pricePerNight: input.pricePerNight,
      totalInventory: input.totalInventory,
      imageUrl: input.imageUrl ?? null,
    });
    await roomModel.replaceRoomAmenities(roomId, input.amenities, connection);
  });

  return getRoom(roomId);
}

export async function deleteRoom(roomId: number) {
  await roomModel.deleteRoom(roomId);
}
