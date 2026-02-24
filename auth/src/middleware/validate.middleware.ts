import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { z, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.ts';

const formatZodErrors = (error: ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));

const validateBody =
  <TSchema extends z.ZodType<unknown>>(schema: TSchema): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return next(ApiError.badRequest('Validation failed', formatZodErrors(parsed.error)));
    }

    req.body = parsed.data as z.infer<TSchema>;
    next();
  };

export { validateBody };
