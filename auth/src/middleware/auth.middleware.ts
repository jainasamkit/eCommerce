import { authoriseUser, createAuthenticateUser } from '@ecommerce/shared-auth';
import { verifyAccessToken } from '../services/token.service.ts';

const authenticateUser = createAuthenticateUser(verifyAccessToken);

export { authenticateUser, authoriseUser };
