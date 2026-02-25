import express from 'express';
import { errorHandler } from './middleware/error.middleware.ts';
import { apiRouter } from './routes/index.ts';

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});
app.use('/api', apiRouter);

app.use(errorHandler);

export default app;
