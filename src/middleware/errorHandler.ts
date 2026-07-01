import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export interface ErrorResponse {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    public message: string,
    public details?: any,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error:', {
    message: err.message,
    code: err.code,
    statusCode: err.statusCode,
    stack: err.stack,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      details: err.details,
      timestamp: new Date().toISOString(),
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: err.errors,
      timestamp: new Date().toISOString(),
    });
  }

  res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong',
    timestamp: new Date().toISOString(),
  });
};
