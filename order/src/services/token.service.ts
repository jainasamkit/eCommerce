import { verifyAccessToken as decodeAccessToken } from '@ecommerce/shared-auth';
import { env } from '../config/env.ts';

const verifyAccessToken = (token: string) => {
  return decodeAccessToken(token, env.ACCESS_TOKEN_SECRET);
};

export { verifyAccessToken };
