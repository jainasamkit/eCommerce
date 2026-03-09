import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { z, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.ts';

type ValidateBodyOptions = {
  requireNonEmptyBody?: boolean;
  allowFileAsBody?: boolean;
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
      const hasFile = Boolean(req.file);

      if (!hasBody && !(options.allowFileAsBody && hasFile)) {
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

export { validateBody };
