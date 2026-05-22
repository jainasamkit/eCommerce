import { authoriseUser, createAuthenticateUser } from '@ecommerce/shared-auth';
import type { RequestHandler } from 'express';
import { verifyAccessToken } from '../services/token.service.ts';

const authenticateUser: RequestHandler = createAuthenticateUser(verifyAccessToken);

export { authenticateUser, authoriseUser };
