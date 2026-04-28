import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/auth.js';
import { ApiError } from '../utils/apiError.js';
import type { UserRole } from '../types/domain.js';

export function requireAuth(request: Request, _response: Response, next: NextFunction) {
  const header = request.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    next(new ApiError(401, 'Authentication required.'));
    return;
  }

  try {
    request.user = verifyToken(header.replace('Bearer ', ''));
    next();
  } catch {
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
