import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { z, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.ts';

type ValidateBodyOptions = {
  requireNonEmptyBody?: boolean;
};

const formatZodErrors = (error: ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));

const validateBody =
  <TSchema extends z.ZodType<unknown>>(
    schema: TSchema,
    options: ValidateBodyOptions = {},
  ): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (options.requireNonEmptyBody) {
      const hasBody =
        typeof req.body === 'object' && req.body !== null && Object.keys(req.body).length > 0;

      if (!hasBody) {
        return next(ApiError.badRequest('Request body cannot be empty'));
      }
    }

    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return next(ApiError.badRequest('Validation failed', formatZodErrors(parsed.error)));
    }

    req.body = parsed.data as z.infer<TSchema>;
    next();
  };

const validateQuery =
  <TSchema extends z.ZodType<unknown>>(schema: TSchema): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);

    if (!parsed.success) {
      return next(ApiError.badRequest('Validation failed', formatZodErrors(parsed.error)));
    }

    req.query = parsed.data as Request['query'];
    next();
  };

const validateParams =
  <TSchema extends z.ZodType<unknown>>(schema: TSchema): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);

    if (!parsed.success) {
      return next(ApiError.badRequest('Validation failed', formatZodErrors(parsed.error)));
    }

    req.params = parsed.data as Request['params'];
    next();
  };

export { validateBody, validateQuery, validateParams };
