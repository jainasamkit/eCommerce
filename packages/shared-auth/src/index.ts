import type { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { ApiError } from '@ecommerce/shared-http';

type AuthUser = {
  id: string;
  role: string;
};

type RequestWithUser<TUser extends AuthUser = AuthUser> = Request & {
  user?: TUser;
};

const verifyAccessToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

const verifyRefreshToken = (token: string, secret: string): JwtPayload => {
  const payload = jwt.verify(token, secret);

  if (typeof payload === 'string') {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  return payload;
};

const createAuthenticateUser =
  <TUser extends AuthUser = AuthUser>(
    verifyToken: (token: string) => TUser | JwtPayload | string,
  ): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(ApiError.unauthorized('Authorization header missing.'));
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return next(ApiError.unauthorized('Authorisation Token missing'));
      }

      const userDetails = verifyToken(token);

      if (!userDetails || typeof userDetails === 'string') {
        return next(ApiError.unauthorized('Invalid or expired token'));
      }

      (req as RequestWithUser<TUser>).user = userDetails as TUser;
      next();
    } catch {
      return next(ApiError.unauthorized('Invalid or expired token'));
    }
  };

const authoriseUser =
  (roles: Array<string>) => (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as RequestWithUser).user;

    if (!user || !roles.includes(user.role)) {
      return next(ApiError.forbidden('Forbidden'));
    }

    next();
  };

export {
  authoriseUser,
  createAuthenticateUser,
  verifyAccessToken,
  verifyRefreshToken,
};
export type { AuthUser };
