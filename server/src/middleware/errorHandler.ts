import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError.js';

export function errorHandler(error: Error, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      message: error.message,
      details: error.details ?? null,
    });
    return;
  }

  response.status(500).json({
    message: 'Internal server error.',
    details: process.env.NODE_ENV === 'development' ? error.message : null,
  });
}
