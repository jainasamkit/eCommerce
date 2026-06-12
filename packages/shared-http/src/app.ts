import express from 'express';
import swaggerUi from 'swagger-ui-express';
import type { Express, Router } from 'express';
import { errorHandler } from './error.middleware.js';

type SwaggerConfig = {
  spec: Record<string, unknown>;
  docsPath?: string;
  jsonPath?: string;
};

const createServiceApp = (
  apiRouter: Router,
  healthMessage: string,
  swagger?: SwaggerConfig,
): Express => {
  const app = express();

  app.use(express.json());
  app.get('/', (_req, res) => {
    res.send(healthMessage);
  });

  if (swagger) {
    const docsPath = swagger.docsPath ?? '/api-docs';
    const jsonPath = swagger.jsonPath ?? '/api-docs.json';
    const title =
      typeof swagger.spec.info === 'object' &&
      swagger.spec.info !== null &&
      'title' in swagger.spec.info &&
      typeof swagger.spec.info.title === 'string'
        ? swagger.spec.info.title
        : 'API Documentation';

    app.get(jsonPath, (_req, res) => {
      res.json(swagger.spec);
    });

    app.use(docsPath, swaggerUi.serve, swaggerUi.setup(swagger.spec, { customSiteTitle: title }));
  }

  app.use('/api', apiRouter);
  app.use(errorHandler);

  return app;
};

export { createServiceApp };
