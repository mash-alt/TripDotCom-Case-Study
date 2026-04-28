import type { Request, Response } from 'express';
import * as bookingService from '../services/bookingService.js';

export async function createRefund(request: Request, response: Response) {
  response.status(201).json(
    await bookingService.cancelBooking({
      bookingId: Number(request.body.bookingId),
      customerId: request.user!.role === 'customer' ? request.user!.id : undefined,
      reason: request.body.reason ?? 'Refund requested',
      force: request.user!.role === 'admin',
    }),
  );
}

export async function listRefunds(_request: Request, response: Response) {
  response.json(await bookingService.listRefunds());
}

export async function deleteRefund(request: Request, response: Response) {
  await bookingService.deleteRefund(Number(request.params.id));
  response.status(204).send();
}
