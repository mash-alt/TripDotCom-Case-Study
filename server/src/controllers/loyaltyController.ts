import type { Request, Response } from 'express';
import * as customerService from '../services/customerService.js';

export async function getLoyalty(request: Request, response: Response) {
  const customer = await customerService.getCustomer(Number(request.params.customerId));
  response.json({
    customerId: customer.id,
    points: customer.loyaltyPoints,
    membershipLevel: customer.membershipLevel,
  });
}
