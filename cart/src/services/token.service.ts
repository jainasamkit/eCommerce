import { verifyAccessToken as verifyJwtAccessToken } from '@ecommerce/shared-auth';
import { env } from '../config/env.ts';

const verifyAccessToken = (token: string) => verifyJwtAccessToken(token, env.ACCESS_TOKEN_SECRET);

export { verifyAccessToken };
