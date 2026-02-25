import { ApiError } from '../utils/ApiError.ts';
import bcrypt from 'bcrypt';
import type { JwtPayload } from 'jsonwebtoken';
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
  updateUserRefreshToken,
} from '../repository/user.repository.ts';
import type {
  LoginUserBody,
  RefreshTokenBody,
  RegisterUserBody,
  UpdateCurrentUserBody,
} from '../validators/user.schema.ts';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from './token.service.ts';

const registerUserService = async (payload: RegisterUserBody) => {
  const existingUser = await findUserByEmail(payload.email);

  if (existingUser) {
    throw ApiError.badRequest('User already exists with this email');
  }

  const user = await createUser({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: 'user',
    ...(payload.profilePic ? { profilePic: payload.profilePic } : {}),
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profilePic: user.profilePic ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const loginUserService = async (payload: LoginUserBody) => {
  const user = await findUserByEmail(payload.email);
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

  return {
    user: {
      id: user._id,
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
};

const refreshAccessTokenService = async (payload: RefreshTokenBody) => {
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

  const user = await findUserById(userId);
  if (!user || user.refreshToken !== payload.refreshToken) {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  const newAccessToken = generateAccessToken(userId, user.role);
  const newRefreshToken = generateRefreshToken(userId, user.role);

  await updateUserRefreshToken(userId, newRefreshToken);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const logoutUserService = async (userId: string) => {
  await updateUserRefreshToken(userId, null);
};

const getCurrentUserService = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profilePic: user.profilePic ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const updateCurrentUserService = async (userId: string, payload: UpdateCurrentUserBody) => {
  const updatePayload: { name?: string; profilePic?: string } = {};

  if (payload.name !== undefined) {
    updatePayload.name = payload.name;
  }

  if (payload.profilePic !== undefined) {
    updatePayload.profilePic = payload.profilePic;
  }

  if (Object.keys(updatePayload).length === 0) {
    throw ApiError.badRequest('No profile fields to update');
  }

  const updatedUser = await updateUserById(userId, updatePayload);
  if (!updatedUser) {
    throw ApiError.notFound('User not found');
  }

  return {
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    profilePic: updatedUser.profilePic ?? null,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  };
};

export {
  registerUserService,
  loginUserService,
  refreshAccessTokenService,
  logoutUserService,
  getCurrentUserService,
  updateCurrentUserService,
};
