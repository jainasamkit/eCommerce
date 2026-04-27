import { createApiRouter } from '@ecommerce/shared-http';
import { v1Router } from './v1/index.ts';

const apiRouter = createApiRouter(v1Router);

export { apiRouter };
