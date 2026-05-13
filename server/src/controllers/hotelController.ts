import type { Request, Response } from 'express';
import * as hotelService from '../services/hotelService.js';

export async function listHotels(request: Request, response: Response) {
  response.json(
    await hotelService.listHotels({
      search: request.query.search?.toString(),
      city: request.query.city?.toString(),
      maxPrice: request.query.maxPrice ? Number(request.query.maxPrice) : undefined,
      stars: request.query.stars ? Number(request.query.stars) : undefined,
      ownerId: request.query.ownerId ? Number(request.query.ownerId) : undefined,
    }),
  );
}

export async function getHotel(request: Request, response: Response) {
  response.json(await hotelService.getHotel(Number(request.params.id)));
}

export async function createHotel(request: Request, response: Response) {
  response.status(201).json(
    await hotelService.createHotel({
      ...request.body,
      ownerId: request.user!.id,
    }),
  );
}

export async function updateHotel(request: Request, response: Response) {
  response.json(await hotelService.updateHotel(Number(request.params.id), request.body, request.user!.id, request.user!.role));
}

export async function deleteHotel(request: Request, response: Response) {
  await hotelService.deleteHotel(Number(request.params.id), request.user!.id);
  response.status(204).send();
}
