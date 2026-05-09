import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/auth.js';
import { ApiError } from '../utils/apiError.js';
import type { UserRole } from '../types/domain.js';

export function requireAuth(request: Request, _response: Response, next: NextFunction) {
  const header = request.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    console.log(`[AUTH] Missing or invalid authorization header for ${request.method} ${request.url}`);
    next(new ApiError(401, 'Authentication required.'));
    return;
  }

  const token = header.replace('Bearer ', '');
  try {
    request.user = verifyToken(token);
    console.log(`[AUTH] Authenticated user ${request.user.email} (${request.user.role})`);
    next();
  } catch (error) {
    console.log(`[AUTH] Token verification failed for ${request.method} ${request.url}:`, error instanceof Error ? error.message : error);
    next(new ApiError(401, 'Invalid or expired token.'));
  }
}

export function requireRole(roles: UserRole[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user) {
      next(new ApiError(401, 'Authentication required.'));
      return;
    }

    if (!roles.includes(request.user.role)) {
      next(new ApiError(403, 'You do not have access to this resource.'));
      return;
    }

    next();
  };
}
