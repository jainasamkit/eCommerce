import express from 'express';
import { errorHandler } from './middleware/error.middleware.ts';
import { userRouter } from './routes/user.routes.ts';

const app = express();
app.use(express.json());
app.use('/api/users', userRouter);

app.use(errorHandler);

export default app;
