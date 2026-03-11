import { ApiError } from '../utils/ApiError.ts';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import type { JwtPayload } from 'jsonwebtoken';
import {
  createUser,
  findUser,
  findUserByEmailWithSensitiveFields,
  findUserByIdWithPassword,
  findUserForLogin,
  findUserForRefreshToken,
  findUserByResetToken,
  resetUserPasswordById,
  updateUserById,
  updateUserPasswordById,
  updateUserPasswordResetToken,
  updateUserRefreshToken,
} from '../repository/user.repository.ts';
import type {
  ChangePasswordBody,
  ForgotPasswordBody,
  LoginUserBody,
  RefreshTokenBody,
  ResetPasswordBody,
} from '../validators/user.schema.ts';
import type {
  ForgotPasswordResponse,
  LoginUserResponse,
  RefreshAccessTokenResponse,
  RegisterUserResponse,
  CreateUserInput,
  UpdateUserProfileInput,
  UserDocument,
  UserLookupFilters,
  UserProfileResponse,
} from '../types/user.types.ts';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './token.service.ts';
import { env } from '../config/env.ts';
import { sendPasswordResetEmail } from './mail.service.ts';

const PASSWORD_RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

const buildPasswordResetUrl = (token: string) => {
  const baseUrl = env.RESET_PASSWORD_URL_BASE;
  const separator = baseUrl!.includes('?') ? '&' : '?';

  return `${baseUrl}${separator}token=${encodeURIComponent(token)}`;
};

const registerUser = async (payload: CreateUserInput): Promise<RegisterUserResponse> => {
  const existingUser: UserDocument | null = await findUser({ email: payload.email });

  if (existingUser) {
    throw ApiError.badRequest('User already exists with this email');
  }

  const user: UserDocument = await createUser({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    ...(payload.profilePic ? { profilePic: payload.profilePic } : {}),
  });

  const createdUserResponse: RegisterUserResponse = {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    profilePic: user.profilePic ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return createdUserResponse;
};

const loginUser = async (payload: LoginUserBody): Promise<LoginUserResponse> => {
  const user: UserDocument | null = await findUserForLogin(payload.email);
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isPasswordCorrect = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordCorrect) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const userId = String(user._id);
  const accessToken = generateAccessToken(userId, user.role);
  const refreshToken = generateRefreshToken(userId, user.role);

  await updateUserRefreshToken(userId, refreshToken);

  const loginResponse: LoginUserResponse = {
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    accessToken,
    refreshToken,
  };

  return loginResponse;
};

const refreshAccessToken = async (
  payload: RefreshTokenBody,
): Promise<RefreshAccessTokenResponse> => {
  let decoded: JwtPayload;
  try {
    decoded = verifyRefreshToken(payload.refreshToken);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const userId = typeof decoded.id === 'string' ? decoded.id : '';
  if (!userId) {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  const user: UserDocument | null = await findUserForRefreshToken(userId);
  if (!user || user.refreshToken !== payload.refreshToken) {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  const newAccessToken = generateAccessToken(userId, user.role);
  const newRefreshToken = generateRefreshToken(userId, user.role);

  await updateUserRefreshToken(userId, newRefreshToken);

  const tokenResponse: RefreshAccessTokenResponse = {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };

  return tokenResponse;
};

const logoutUser = async (userId: string) => {
  await updateUserRefreshToken(userId, null);
};

const forgotPassword = async (payload: ForgotPasswordBody): Promise<ForgotPasswordResponse> => {
  const user: UserDocument | null = await findUserByEmailWithSensitiveFields(payload.email);

  if (!user) {
    return { resetUrl: null };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const passwordResetTokenExpiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);

  await updateUserPasswordResetToken(
    String(user._id),
    hashedResetToken,
    passwordResetTokenExpiresAt,
  );

  const resetUrl = buildPasswordResetUrl(resetToken);
  await sendPasswordResetEmail(user.email, resetUrl);

  return { resetUrl: null };
};

const resetPassword = async (payload: ResetPasswordBody): Promise<void> => {
  const hashedResetToken = crypto.createHash('sha256').update(payload.token).digest('hex');
  const user: UserDocument | null = await findUserByResetToken(hashedResetToken);

  if (!user) {
    throw ApiError.badRequest('Invalid or expired reset token');
  }

  const isSamePassword = await bcrypt.compare(payload.newPassword, user.password);
  if (isSamePassword) {
    throw ApiError.badRequest('New password must be different from current password');
  }

  const hashedNewPassword = await bcrypt.hash(payload.newPassword, 10);
  await resetUserPasswordById(String(user._id), hashedNewPassword);
};

const getProfile = async (userId: string): Promise<UserProfileResponse> => {
  const userLookupPayload: UserLookupFilters = { _id: userId };
  const user: UserDocument | null = await findUser(userLookupPayload);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return user;
};

const updateProfile = async (
  userId: string,
  payload: UpdateUserProfileInput,
): Promise<UserProfileResponse> => {
  const updatePayload: UpdateUserProfileInput = {};

  if (payload.name !== undefined) {
    updatePayload.name = payload.name;
  }

  if (payload.profilePic !== undefined) {
    updatePayload.profilePic = payload.profilePic;
  }

  const updatedUser: UserDocument | null = await updateUserById(userId, updatePayload);
  if (!updatedUser) {
    throw ApiError.notFound('User not found');
  }

  return updatedUser;
};

const changePassword = async (userId: string, payload: ChangePasswordBody): Promise<void> => {
  const user: UserDocument | null = await findUserByIdWithPassword(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isCurrentPasswordCorrect = await bcrypt.compare(payload.currentPassword, user.password);
  if (!isCurrentPasswordCorrect) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  const isSamePassword = await bcrypt.compare(payload.newPassword, user.password);
  if (isSamePassword) {
    throw ApiError.badRequest('New password must be different from current password');
  }

  const hashedNewPassword = await bcrypt.hash(payload.newPassword, 10);
  await updateUserPasswordById(userId, hashedNewPassword);

  await updateUserRefreshToken(userId, null);
};

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
};
