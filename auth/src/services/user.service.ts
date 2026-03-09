import { ApiError } from '../utils/ApiError.ts';
import bcrypt from 'bcrypt';
import type { JwtPayload } from 'jsonwebtoken';
import {
  createUser,
  findUser,
  findUserForLogin,
  findUserForRefreshToken,
  updateUserById,
  updateUserRefreshToken,
} from '../repository/user.repository.ts';
import type {
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

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getProfile,
  updateProfile,
};
