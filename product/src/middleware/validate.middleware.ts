import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { z, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.ts';

const formatZodErrors = (error: ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));

const validateQuery =
  <TSchema extends z.ZodType<unknown>>(schema: TSchema): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);

    if (!parsed.success) {
      return next(ApiError.badRequest('Validation failed', formatZodErrors(parsed.error)));
    }

    next();
  };

const validateParams =
  <TSchema extends z.ZodType<unknown>>(schema: TSchema): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);

    if (!parsed.success) {
      return next(ApiError.badRequest('Validation failed', formatZodErrors(parsed.error)));
    }

    next();
  };

export { validateQuery, validateParams };
