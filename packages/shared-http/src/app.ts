import express from 'express';
import type { Express, Router } from 'express';
import { errorHandler } from './error.middleware.js';

const createServiceApp = (apiRouter: Router, healthMessage: string): Express => {
  const app = express();

  app.use(express.json());
  app.get('/', (_req, res) => {
    res.send(healthMessage);
  });
  app.use('/api', apiRouter);
  app.use(errorHandler);

  return app;
};

export { createServiceApp };
