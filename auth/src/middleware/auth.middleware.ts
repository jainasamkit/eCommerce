import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.ts';
import { verifyAccessToken } from '../services/token.service.ts';
import type { AuthUser } from '../types/request.types.ts';

const authenticateUser = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('Authorization header missing.'));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(ApiError.unauthorized('Authorisation Token missing'));
    }

    const userDetails = verifyAccessToken(token) as AuthUser;
    req.user = userDetails;
    next();
  } catch {
    return next(ApiError.unauthorized('Invalid or expired token'));
  }
};

const authoriseUser = (roles: Array<string>) => (req: Request, _: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(ApiError.forbidden('Forbidden'));
  }
  next();
};

export { authenticateUser, authoriseUser };
