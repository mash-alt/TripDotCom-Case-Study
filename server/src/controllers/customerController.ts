import type { Request, Response } from 'express';
import * as customerService from '../services/customerService.js';

export async function listCustomers(_request: Request, response: Response) {
  response.json(await customerService.listCustomers());
}

export async function getCustomer(request: Request, response: Response) {
  response.json(await customerService.getCustomer(Number(request.params.id)));
}

export async function updateCustomer(request: Request, response: Response) {
  response.json(await customerService.updateCustomer(Number(request.params.id), request.body));
}

export async function deleteCustomer(request: Request, response: Response) {
  await customerService.deleteCustomer(Number(request.params.id));
  response.status(204).send();
}
