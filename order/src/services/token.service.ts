import jwt from 'jsonwebtoken';
import { env } from '../config/env.ts';

const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
};

export { verifyAccessToken };
