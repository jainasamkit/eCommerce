import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.ts';
import { validateBody } from '../middleware/validate.middleware.ts';
import { registerUserSchema } from '../validators/user.schema.ts';

const userRouter = Router();

userRouter.post('/register', validateBody(registerUserSchema), registerUser);

export { userRouter };
