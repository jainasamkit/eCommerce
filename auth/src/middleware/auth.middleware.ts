import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.ts';
import { ApiError } from '../utils/ApiError.ts';

const { JWT_SECRET } = env;

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

    const decodedToken = jwt.verify(token, JWT_SECRET!) as IUserToken;
    req.user = decodedToken;
    next();
  } catch {
    return next(ApiError.unauthorized('Invalid or expired token'));
  }
};

const authoriseUser = async (
  req: Request,
  _: Response,
  next: NextFunction,
  roles: Array<string>,
) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(ApiError.forbidden('Forbidden'));
  }
  next();
};

export { authenticateUser, authoriseUser };
