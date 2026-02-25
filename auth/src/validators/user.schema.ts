import { z } from 'zod';

const registerUserSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.string().trim().toLowerCase().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(
        /[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~+=;']/,
        'Password must contain at least one special character',
      ),
    profilePic: z.string().trim().url('Profile pic must be a valid URL').optional(),
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

const updateCurrentUserSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
    profilePic: z.string().trim().url('Profile pic must be a valid URL').optional(),
  })
  .strict();

type RegisterUserBody = z.infer<typeof registerUserSchema>;
type LoginUserBody = z.infer<typeof loginUserSchema>;
type RefreshTokenBody = z.infer<typeof refreshTokenSchema>;
type UpdateCurrentUserBody = z.infer<typeof updateCurrentUserSchema>;

export { registerUserSchema };
export { loginUserSchema, refreshTokenSchema, updateCurrentUserSchema };
export type { RegisterUserBody, LoginUserBody, RefreshTokenBody, UpdateCurrentUserBody };
