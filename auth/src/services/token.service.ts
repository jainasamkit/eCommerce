import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.ts';
import { ApiError } from '../utils/ApiError.ts';

const ensureAccessTokenSecret = () => {
  if (!env.ACCESS_TOKEN_SECRET) {
    throw ApiError.internal('ACCESS_TOKEN_SECRET is not configured');
  }
};

const ensureRefreshTokenSecret = () => {
  if (!env.REFRESH_TOKEN_SECRET) {
    throw ApiError.internal('REFRESH_TOKEN_SECRET is not configured');
  }
};

const generateAccessToken = (id: string, role: string) => {
  ensureAccessTokenSecret();
  const accessTokenExpiry = env.ACCESS_TOKEN_EXPIRY as NonNullable<SignOptions['expiresIn']>;

  return jwt.sign({ id, role }, env.ACCESS_TOKEN_SECRET!, {
    expiresIn: accessTokenExpiry,
  });
};

const generateRefreshToken = (id: string, role: string) => {
  ensureRefreshTokenSecret();
  const refreshTokenExpiry = env.REFRESH_TOKEN_EXPIRY as NonNullable<SignOptions['expiresIn']>;

  return jwt.sign({ id, role }, env.REFRESH_TOKEN_SECRET!, {
    expiresIn: refreshTokenExpiry,
  });
};

const verifyAccessToken = (token: string) => {
  ensureAccessTokenSecret();
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET!);
};

const verifyRefreshToken = (token: string): JwtPayload => {
  ensureRefreshTokenSecret();

  const payload = jwt.verify(token, env.REFRESH_TOKEN_SECRET!);
  if (typeof payload === 'string') {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  return payload;
};

export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
