import type { Request, Response } from 'express';
import * as supportService from '../services/supportService.js';

export async function listSupportTickets(request: Request, response: Response) {
  const customerId = request.user!.role === 'customer' ? request.user!.id : undefined;
  response.json(await supportService.listSupportTickets(customerId));
}

export async function createSupportTicket(request: Request, response: Response) {
  response.status(201).json(
    await supportService.createSupportTicket({
      ...request.body,
      customerId: request.user!.id,
    }),
  );
}

export async function resolveSupportTicket(request: Request, response: Response) {
  response.json(
    await supportService.resolveSupportTicket({
      supportId: Number(request.params.id),
      adminId: request.user!.id,
      status: request.body.status,
      resolutionNotes: request.body.resolutionNotes,
    }),
  );
}

export async function deleteSupportTicket(request: Request, response: Response) {
  await supportService.deleteSupportTicket(Number(request.params.id));
  response.status(204).send();
}
