import * as supportModel from '../models/supportModel.js';
import { ApiError } from '../utils/apiError.js';

export async function listSupportTickets(customerId?: number, adminId?: number) {
  return supportModel.listSupportTickets({ customerId, adminId });
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
  adminId: number;
  status: 'InProgress' | 'Resolved';
  resolutionNotes?: string;
}) {
  await supportModel.updateSupportTicket(input.supportId, input);
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
