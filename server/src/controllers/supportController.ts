import type { Request, Response } from 'express';
import * as supportService from '../services/supportService.js';

export async function listSupportTickets(request: Request, response: Response) {
  const { role, id, ownerId } = request.user!;
  const customerId = role === 'customer' ? id : undefined;

  let scopedOwnerId: number | undefined;
  if (role === 'hotel_owner') {
    scopedOwnerId = id;
  } else if (role === 'hotel_staff') {
    scopedOwnerId = ownerId ?? undefined;
  }

  response.json(await supportService.listSupportTickets(customerId, scopedOwnerId));
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
      resolverId: request.user!.id,
      resolverType: request.user!.role as 'admin' | 'hotel_owner' | 'hotel_staff',
      status: request.body.status,
      resolutionNotes: request.body.resolutionNotes,
    }),
  );
}

export async function deleteSupportTicket(request: Request, response: Response) {
  await supportService.deleteSupportTicket(Number(request.params.id));
  response.status(204).send();
}
