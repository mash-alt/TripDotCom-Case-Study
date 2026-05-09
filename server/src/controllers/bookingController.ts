import type { Request, Response } from 'express';
import * as bookingService from '../services/bookingService.js';

export async function createBooking(request: Request, response: Response) {
  response.status(201).json(
    await bookingService.createBooking({
      ...request.body,
      customerId: request.user!.id,
      coinsRedeemed: request.body.coinsRedeemed ? Number(request.body.coinsRedeemed) : undefined,
    }),
  );
}

export async function listCustomerBookings(request: Request, response: Response) {
  try {
    const requestedCustomerId = Number(request.params.customerId);
    const customerId = request.user!.role === 'admin' ? requestedCustomerId : request.user!.id;
    response.json(await bookingService.listBookings(customerId));
  } catch (err) {
    console.error('Error in listCustomerBookings:', err);
    throw err;
  }
}

export async function listAllBookings(request: Request, response: Response) {
  try {
    const adminId = request.user!.id === 1 ? undefined : request.user!.id;
    response.json(await bookingService.listBookings(undefined, adminId));
  } catch (err) {
    console.error('Error in listAllBookings:', err);
    throw err;
  }
}

export async function checkInBooking(request: Request, response: Response) {
  response.json(await bookingService.checkInBooking(Number(request.params.id)));
}

export async function completeBooking(request: Request, response: Response) {
  response.json(await bookingService.completeBooking(Number(request.params.id)));
}

export async function cancelBooking(request: Request, response: Response) {
  response.json(
    await bookingService.cancelBooking({
      bookingId: Number(request.params.id),
      customerId: request.user!.role === 'customer' ? request.user!.id : undefined,
      reason: request.body.reason ?? 'Customer requested cancellation',
      force: request.user!.role === 'admin',
    }),
  );
}

export async function updateInternalNotes(request: Request, response: Response) {
  response.json(
    await bookingService.updateInternalNotes(Number(request.params.id), request.body.notes)
  );
}

export async function deleteBooking(request: Request, response: Response) {
  await bookingService.deleteBooking(Number(request.params.id));
  response.status(204).send();
}
