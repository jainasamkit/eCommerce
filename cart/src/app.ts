import { createServiceApp } from '@ecommerce/shared-http';
import { apiRouter } from './routes/index.ts';

const app = createServiceApp(apiRouter, 'Cart service is running');

export default app;
