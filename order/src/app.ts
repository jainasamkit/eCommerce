import { createServiceApp } from '@ecommerce/shared-http';
import { apiRouter } from './routes/index.ts';
import { swaggerSpec } from './docs/swagger.ts';

const app = createServiceApp(apiRouter, 'Order service is running', {
  spec: swaggerSpec,
});

export default app;
