import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.ts';
import { verifyAccessToken } from '../services/token.service.ts';

interface IUserToken {
  id: string;
  role: string;
}

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

    const decodedToken = verifyAccessToken(token) as IUserToken;
    req.user = decodedToken;
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
