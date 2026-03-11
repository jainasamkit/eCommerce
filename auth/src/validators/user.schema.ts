import { z } from 'zod';

const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(
    /[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~+=;']/,
    'Password must contain at least one special character',
  );

const registerUserSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.string().trim().toLowerCase().email('Invalid email address'),
    password: strongPasswordSchema,
  })
  .strict();

const loginUserSchema = z
  .object({
    email: z.string().trim().toLowerCase().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  })
  .strict();

const refreshTokenSchema = z
  .object({
    refreshToken: z.string().trim().min(1, 'Refresh token is required'),
  })
  .strict();

const forgotPasswordSchema = z
  .object({
    email: z.string().trim().toLowerCase().email('Invalid email address'),
  })
  .strict();

const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, 'Reset token is required'),
    newPassword: strongPasswordSchema,
  })
  .strict();

const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
  })
  .strict();

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: strongPasswordSchema,
  })
  .strict();

type RegisterUserBody = z.infer<typeof registerUserSchema>;
type LoginUserBody = z.infer<typeof loginUserSchema>;
type RefreshTokenBody = z.infer<typeof refreshTokenSchema>;
type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordBody = z.infer<typeof resetPasswordSchema>;
type UpdateProfileBody = z.infer<typeof updateProfileSchema>;
type ChangePasswordBody = z.infer<typeof changePasswordSchema>;

export { registerUserSchema };
export {
  loginUserSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
};
export type {
  RegisterUserBody,
  LoginUserBody,
  RefreshTokenBody,
  ForgotPasswordBody,
  ResetPasswordBody,
  UpdateProfileBody,
  ChangePasswordBody,
};
