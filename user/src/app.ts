import { createServiceApp } from '@ecommerce/shared-http';
import { apiRouter } from './routes/index.ts';

const app = createServiceApp(apiRouter, 'User service is running');

export default app;
