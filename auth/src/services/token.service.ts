import type { JwtPayload, SignOptions } from 'jsonwebtoken';
import {
  generateAccessToken as createAccessToken,
  generateRefreshToken as createRefreshToken,
  verifyAccessToken as decodeAccessToken,
  verifyRefreshToken as decodeRefreshToken,
} from '@ecommerce/shared-auth';
import { env } from '../config/env.ts';

const generateAccessToken = (id: string, role: string) => {
  const accessTokenExpiry = env.ACCESS_TOKEN_EXPIRY as NonNullable<SignOptions['expiresIn']>;

  return createAccessToken({ id, role }, env.ACCESS_TOKEN_SECRET, accessTokenExpiry);
};

const generateRefreshToken = (id: string, role: string) => {
  const refreshTokenExpiry = env.REFRESH_TOKEN_EXPIRY as NonNullable<SignOptions['expiresIn']>;

  return createRefreshToken({ id, role }, env.REFRESH_TOKEN_SECRET, refreshTokenExpiry);
};

const verifyAccessToken = (token: string) => {
  return decodeAccessToken(token, env.ACCESS_TOKEN_SECRET);
};

const verifyRefreshToken = (token: string): JwtPayload => {
  return decodeRefreshToken(token, env.REFRESH_TOKEN_SECRET);
};

export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
