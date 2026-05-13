import * as supportModel from '../models/supportModel.js';
import type { UserRole } from '../types/domain.js';
import { ApiError } from '../utils/apiError.js';

export async function listSupportTickets(customerId?: number, ownerId?: number) {
  return supportModel.listSupportTickets({ customerId, ownerId });
}

export async function createSupportTicket(input: {
  customerId: number;
  bookingId?: number | null;
  subject: string;
  message: string;
}) {
  const supportId = await supportModel.createSupportTicket(input);
  const tickets = await supportModel.listSupportTickets({ customerId: input.customerId });
  return tickets.find((ticket) => ticket.supportId === supportId) ?? null;
}

export async function resolveSupportTicket(input: {
  supportId: number;
  resolverId: number;
  resolverType: UserRole;
  status: 'InProgress' | 'Resolved';
  resolutionNotes?: string;
}) {
  await supportModel.updateSupportTicket(input.supportId, {
    status: input.status,
    resolverId: input.resolverId,
    resolverType: input.resolverType,
    resolutionNotes: input.resolutionNotes,
  });
  const tickets = await supportModel.listSupportTickets({});
  const ticket = tickets.find((item) => item.supportId === input.supportId);

  if (!ticket) {
    throw new ApiError(404, 'Support ticket not found.');
  }

  return ticket;
}

export async function deleteSupportTicket(supportId: number) {
  await supportModel.deleteSupportTicket(supportId);
}
