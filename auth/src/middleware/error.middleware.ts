import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError.ts';

const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
  }

  console.error('Unhandled error:', err);

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    errors: [],
    data: null,
  });
};

export { errorHandler };
