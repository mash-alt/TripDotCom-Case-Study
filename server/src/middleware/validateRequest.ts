import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/apiError.js';

export function validateRequest(request: Request, _response: Response, next: NextFunction) {
  const result = validationResult(request);

  if (!result.isEmpty()) {
    const errors = result.array();
    console.log(`[VALIDATION ERROR] ${request.method} ${request.url}:`, JSON.stringify(errors, null, 2));
    next(new ApiError(400, 'Validation failed.', errors));
    return;
  }

  next();
}
