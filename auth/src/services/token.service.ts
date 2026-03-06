import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.ts';
import { ApiError } from '../utils/ApiError.ts';

const generateAccessToken = (id: string, role: string) => {
  const accessTokenExpiry = env.ACCESS_TOKEN_EXPIRY as NonNullable<SignOptions['expiresIn']>;

  return jwt.sign({ id, role }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: accessTokenExpiry,
  });
};

const generateRefreshToken = (id: string, role: string) => {
  const refreshTokenExpiry = env.REFRESH_TOKEN_EXPIRY as NonNullable<SignOptions['expiresIn']>;

  return jwt.sign({ id, role }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: refreshTokenExpiry,
  });
};

const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
};

const verifyRefreshToken = (token: string): JwtPayload => {
  const payload = jwt.verify(token, env.REFRESH_TOKEN_SECRET);
  if (typeof payload === 'string') {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  return payload;
};

export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
