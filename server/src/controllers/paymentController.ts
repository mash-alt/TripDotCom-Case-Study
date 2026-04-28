import type { Request, Response } from 'express';
import * as bookingService from '../services/bookingService.js';

export async function createPayment(request: Request, response: Response) {
  response.status(201).json(
    await bookingService.confirmBookingPayment({
      ...request.body,
      customerId: request.user!.id,
    }),
  );
}

export async function listPayments(_request: Request, response: Response) {
  response.json(await bookingService.listPayments());
}

export async function deletePayment(request: Request, response: Response) {
  await bookingService.deletePayment(Number(request.params.id));
  response.status(204).send();
}
