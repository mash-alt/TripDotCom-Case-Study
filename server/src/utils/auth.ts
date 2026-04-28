import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthUser } from '../types/domain.js';

export function signToken(user: AuthUser) {
  return jwt.sign(user, env.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as AuthUser;
}
