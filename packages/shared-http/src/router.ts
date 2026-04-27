import { Router } from 'express';

const createApiRouter = (v1Router: Router): Router => {
  const apiRouter = Router();
  apiRouter.use('/v1', v1Router);
  return apiRouter;
};

export { createApiRouter };
