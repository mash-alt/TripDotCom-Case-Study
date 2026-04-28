import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/apiError.js';

export function validateRequest(request: Request, _response: Response, next: NextFunction) {
  const result = validationResult(request);

  if (!result.isEmpty()) {
    next(new ApiError(400, 'Validation failed.', result.array()));
    return;
  }

  next();
}
