import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.ts';
import { ApiResponse } from '../utils/ApiResponse.ts';
import {
  getCurrentUserService,
  loginUserService,
  logoutUserService,
  refreshAccessTokenService,
  registerUserService,
  updateCurrentUserService,
} from '../services/user.service.ts';
import { uploadFileToR2 } from '../services/r2.service.ts';
import { ApiError } from '../utils/ApiError.ts';
import type {
  LoginUserBody,
  RefreshTokenBody,
  RegisterUserBody,
  UpdateCurrentUserBody,
} from '../validators/user.schema.ts';

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const userData = req.body as RegisterUserBody;

  if (req.file) {
    const { url } = await uploadFileToR2(req.file, 'users/profile-pics');
    userData.profilePic = url;
  }

  const createdUser = await registerUserService(userData);

  return res.status(201).json(ApiResponse.created(createdUser, 'User registered successfully'));
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const credentials = req.body as LoginUserBody;
  const loginData = await loginUserService(credentials);

  return res.status(200).json(ApiResponse.success(loginData, 'User logged in successfully'));
});

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as RefreshTokenBody;
  const tokens = await refreshAccessTokenService(payload);

  return res.status(200).json(ApiResponse.success(tokens, 'Token refreshed successfully'));
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw ApiError.unauthorized('Unauthorized');
  }

  await logoutUserService(req.user.id);

  return res.status(200).json(ApiResponse.success(null, 'User logged out successfully'));
});

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw ApiError.unauthorized('Unauthorized');
  }

  const user = await getCurrentUserService(req.user.id);

  return res.status(200).json(ApiResponse.success(user, 'Current user fetched successfully'));
});

const updateCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw ApiError.unauthorized('Unauthorized');
  }

  const payload = req.body as UpdateCurrentUserBody;

  if (req.file) {
    const { url } = await uploadFileToR2(req.file, 'users/profile-pics');
    payload.profilePic = url;
  }

  const updatedUser = await updateCurrentUserService(req.user.id, payload);

  return res.status(200).json(ApiResponse.success(updatedUser, 'Profile updated successfully'));
});

export { registerUser, loginUser, refreshAccessToken, logoutUser, getCurrentUser, updateCurrentUser };
