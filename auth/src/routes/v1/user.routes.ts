import { Router } from 'express';
import {
  changePassword,
  forgotPassword,
  getProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resetPassword,
  updateProfile,
} from '../../controllers/user.controller.ts';
import { authenticateUser, authoriseUser } from '../../middleware/auth.middleware.ts';
import { createSingleFileUpload } from '../../middleware/multer.middleware.ts';
import { validateBody } from '../../middleware/validate.middleware.ts';
import { UserRole } from '../../types/user.types.ts';
import {
  forgotPasswordSchema,
  loginUserSchema,
  refreshTokenSchema,
  resetPasswordSchema,
  registerUserSchema,
  changePasswordSchema,
  updateProfileSchema,
} from '../../validators/user.schema.ts';

const userRouter = Router();
const uploadProfilePic = createSingleFileUpload({ fieldName: 'profilePic' });

userRouter.post('/register', uploadProfilePic, validateBody(registerUserSchema), registerUser);
userRouter.post('/login', validateBody(loginUserSchema), loginUser);
userRouter.post('/refresh-token', validateBody(refreshTokenSchema), refreshAccessToken);
userRouter.post('/forgot-password', validateBody(forgotPasswordSchema), forgotPassword);
userRouter.post('/reset-password', validateBody(resetPasswordSchema), resetPassword);

userRouter.use(
  ['/logout', '/profile', '/change-password'],
  authenticateUser,
  authoriseUser([UserRole.USER]),
);

userRouter.post('/logout', logoutUser);
userRouter.post('/change-password', validateBody(changePasswordSchema), changePassword);
userRouter.get('/profile', getProfile);
userRouter.patch(
  '/profile',
  uploadProfilePic,
  validateBody(updateProfileSchema, { requireNonEmptyBody: true, allowFileAsBody: true }),
  updateProfile,
);

export { userRouter };
