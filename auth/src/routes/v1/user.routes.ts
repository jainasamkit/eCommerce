import { Router } from 'express';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateCurrentUser,
} from '../../controllers/user.controller.ts';
import { authenticateUser, authoriseUser } from '../../middleware/auth.middleware.ts';
import { createSingleFileUpload } from '../../middleware/multer.middleware.ts';
import { validateBody } from '../../middleware/validate.middleware.ts';
import {
  loginUserSchema,
  refreshTokenSchema,
  registerUserSchema,
  updateCurrentUserSchema,
} from '../../validators/user.schema.ts';

const userRouter = Router();
const uploadProfilePic = createSingleFileUpload({ fieldName: 'profilePic' });

userRouter.post('/register', uploadProfilePic, validateBody(registerUserSchema), registerUser);
userRouter.post('/login', validateBody(loginUserSchema), loginUser);
userRouter.post('/refresh-token', validateBody(refreshTokenSchema), refreshAccessToken);

userRouter.use(['/logout', '/me'], authenticateUser, authoriseUser(['user']));

userRouter.post('/logout', logoutUser);
userRouter.get('/me', getCurrentUser);
userRouter.patch(
  '/me',
  uploadProfilePic,
  validateBody(updateCurrentUserSchema),
  updateCurrentUser,
);

export { userRouter };
