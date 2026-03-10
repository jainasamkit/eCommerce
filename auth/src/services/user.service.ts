import { ApiError } from '../utils/ApiError.ts';
import bcrypt from 'bcrypt';
import type { JwtPayload } from 'jsonwebtoken';
import {
  createUser,
  findUser,
  findUserByIdWithPassword,
  findUserForLogin,
  findUserForRefreshToken,
  updateUserById,
  updateUserPasswordById,
  updateUserRefreshToken,
} from '../repository/user.repository.ts';
import type {
  ChangePasswordBody,
  LoginUserBody,
  RefreshTokenBody,
} from '../validators/user.schema.ts';
import type {
  LoginUserResponse,
  RefreshAccessTokenResponse,
  RegisterUserResponse,
  CreateUserInput,
  UpdateUserProfileInput,
  UserDocument,
  UserLookupFilters,
  UserProfileResponse,
} from '../types/user.types.ts';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from './token.service.ts';

const registerUser = async (
  payload: CreateUserInput,
): Promise<RegisterUserResponse> => {
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

const changePassword = async (
  userId: string,
  payload: ChangePasswordBody,
): Promise<void> => {
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
  getProfile,
  updateProfile,
  changePassword,
};
