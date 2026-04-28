import type { Request, Response } from 'express';
import * as authService from '../services/authService.js';

export async function register(request: Request, response: Response) {
  const session = await authService.registerCustomer(request.body);
  response.status(201).json(session);
}

export async function login(request: Request, response: Response) {
  const session = await authService.login(request.body);
  response.json(session);
}

export async function me(request: Request, response: Response) {
  const session = await authService.getMe(request.user!.id, request.user!.role);
  response.json(session);
}
