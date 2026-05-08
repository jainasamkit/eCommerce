import type { JwtPayload, SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import {
  verifyAccessToken as decodeAccessToken,
  verifyRefreshToken as decodeRefreshToken,
} from '@ecommerce/shared-auth';
import { env } from '../config/env.ts';

const generateAccessToken = (id: string, role: string) => {
  const accessTokenExpiry = env.ACCESS_TOKEN_EXPIRY as NonNullable<SignOptions['expiresIn']>;

  return jwt.sign({ id, role }, env.ACCESS_TOKEN_SECRET, { expiresIn: accessTokenExpiry });
};

const generateRefreshToken = (id: string, role: string) => {
  const refreshTokenExpiry = env.REFRESH_TOKEN_EXPIRY as NonNullable<SignOptions['expiresIn']>;

  return jwt.sign({ id, role }, env.REFRESH_TOKEN_SECRET, { expiresIn: refreshTokenExpiry });
};

const verifyAccessToken = (token: string) => {
  return decodeAccessToken(token, env.ACCESS_TOKEN_SECRET);
};

const verifyRefreshToken = (token: string): JwtPayload => {
  return decodeRefreshToken(token, env.REFRESH_TOKEN_SECRET);
};

export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
