import express, { type Request, type Response } from 'express';
import { errorHandler } from './middleware/error.middleware.ts';
import { apiRouter } from './routes/index.ts';

const app = express();

app.use(express.json());
app.get('/', (_req: Request, res: Response) => {
  res.send('Product service is running');
});
app.use('/api', apiRouter);

app.use(errorHandler);

export default app;
