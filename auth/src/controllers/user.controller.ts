import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.ts';
import { ApiResponse } from '../utils/ApiResponse.ts';
import * as userService from '../services/user.service.ts';
import type { UploadFileResponse } from '../types/storage.types.ts';
import type {
  GetProfileResponse,
  LoginUserResponse,
  RefreshAccessTokenResponse,
  RegisterUserResponse,
  RegisterUserServicePayload,
  UpdateProfileServicePayload,
  UpdateProfileResponse,
} from '../types/user.types.ts';
import { uploadFileToR2 } from '../services/r2.service.ts';
import { ApiError } from '../utils/ApiError.ts';
import type {
  LoginUserBody,
  RefreshTokenBody,
} from '../validators/user.schema.ts';

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const userData: RegisterUserServicePayload = req.body;

  if (req.file) {
    const uploadResult: UploadFileResponse = await uploadFileToR2(req.file, 'users/profile-pics');
    const { url } = uploadResult;
    userData.profilePic = url;
  }

  const createdUser: RegisterUserResponse = await userService.registerUser(userData);

  return res.status(201).json(ApiResponse.created(createdUser, 'User registered successfully'));
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const credentials: LoginUserBody = req.body;
  const loginData: LoginUserResponse = await userService.loginUser(credentials);

  return res.status(200).json(ApiResponse.success(loginData, 'User logged in successfully'));
});

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const payload: RefreshTokenBody = req.body;
  const tokens: RefreshAccessTokenResponse = await userService.refreshAccessToken(payload);

  return res.status(200).json(ApiResponse.success(tokens, 'Token refreshed successfully'));
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw ApiError.unauthorized('Unauthorized');
  }

  await userService.logoutUser(req.user.id);

  return res.status(200).json(ApiResponse.success(null, 'User logged out successfully'));
});

const getProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw ApiError.unauthorized('Unauthorized');
  }

  const user: GetProfileResponse = await userService.getProfile(req.user.id);

  return res.status(200).json(ApiResponse.success(user, 'Profile fetched successfully'));
});

const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw ApiError.unauthorized('Unauthorized');
  }

  const payload: UpdateProfileServicePayload = req.body;

  if (req.file) {
    const uploadResult: UploadFileResponse = await uploadFileToR2(req.file, 'users/profile-pics');
    const { url } = uploadResult;
    payload.profilePic = url;
  }

  const updatedUser: UpdateProfileResponse = await userService.updateProfile(req.user.id, payload);

  return res.status(200).json(ApiResponse.success(updatedUser, 'Profile updated successfully'));
});

export { registerUser, loginUser, refreshAccessToken, logoutUser, getProfile, updateProfile };
