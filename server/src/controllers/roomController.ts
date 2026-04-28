import type { Request, Response } from 'express';
import * as roomService from '../services/roomService.js';

export async function listRooms(request: Request, response: Response) {
  response.json(
    await roomService.listRooms({
      hotelId: request.query.hotelId ? Number(request.query.hotelId) : undefined,
    }),
  );
}

export async function getRoom(request: Request, response: Response) {
  response.json(await roomService.getRoom(Number(request.params.id)));
}

export async function createRoom(request: Request, response: Response) {
  response.status(201).json(await roomService.createRoom(request.body));
}

export async function updateRoom(request: Request, response: Response) {
  response.json(await roomService.updateRoom(Number(request.params.id), request.body));
}

export async function deleteRoom(request: Request, response: Response) {
  await roomService.deleteRoom(Number(request.params.id));
  response.status(204).send();
}
