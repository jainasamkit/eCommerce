import type { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse.ts';
import * as userService from '../services/user.service.ts';
import type { UploadFileResponse } from '../types/storage.types.ts';
import type {
  ForgotPasswordResponse,
  LoginUserResponse,
  RefreshAccessTokenResponse,
  RegisterUserResponse,
  CreateUserInput,
  UpdateUserProfileInput,
  UserProfileResponse,
} from '../types/user.types.ts';
import { uploadFileToR2 } from '../services/r2.service.ts';
import { ApiError } from '../utils/ApiError.ts';
import type {
  ChangePasswordBody,
  ForgotPasswordBody,
  LoginUserBody,
  RefreshTokenBody,
  ResetPasswordBody,
} from '../validators/user.schema.ts';

const registerUser = async (req: Request, res: Response) => {
  const userData: CreateUserInput = req.body;

  if (req.file) {
    const uploadResult: UploadFileResponse = await uploadFileToR2(req.file, 'users/profile-pics');
    const { url } = uploadResult;
    userData.profilePic = url;
  }

  const createdUser: RegisterUserResponse = await userService.registerUser(userData);

  return res.status(201).json(ApiResponse.created(createdUser, 'User registered successfully'));
};

const loginUser = async (req: Request, res: Response) => {
  const credentials: LoginUserBody = req.body;
  const loginData: LoginUserResponse = await userService.loginUser(credentials);

  return res.status(200).json(ApiResponse.success(loginData, 'User logged in successfully'));
};

const refreshAccessToken = async (req: Request, res: Response) => {
  const payload: RefreshTokenBody = req.body;
  const tokens: RefreshAccessTokenResponse = await userService.refreshAccessToken(payload);

  return res.status(200).json(ApiResponse.success(tokens, 'Token refreshed successfully'));
};

const forgotPassword = async (req: Request, res: Response) => {
  const payload: ForgotPasswordBody = req.body;
  const resetData: ForgotPasswordResponse = await userService.forgotPassword(payload);

  return res
    .status(200)
    .json(ApiResponse.success(resetData, 'If the email exists, reset instructions were generated'));
};

const resetPassword = async (req: Request, res: Response) => {
  const payload: ResetPasswordBody = req.body;
  await userService.resetPassword(payload);

  return res.status(200).json(ApiResponse.success(null, 'Password reset successfully'));
};

const logoutUser = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw ApiError.unauthorized('Unauthorized');
  }

  await userService.logoutUser(req.user.id);

  return res.status(200).json(ApiResponse.success(null, 'User logged out successfully'));
};

const getProfile = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw ApiError.unauthorized('Unauthorized');
  }

  const user: UserProfileResponse = await userService.getProfile(req.user.id);

  return res.status(200).json(ApiResponse.success(user, 'Profile fetched successfully'));
};

const updateProfile = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw ApiError.unauthorized('Unauthorized');
  }

  const payload: UpdateUserProfileInput = req.body;

  if (req.file) {
    const uploadResult: UploadFileResponse = await uploadFileToR2(req.file, 'users/profile-pics');
    const { url } = uploadResult;
    payload.profilePic = url;
  }

  const updatedUser: UserProfileResponse = await userService.updateProfile(req.user.id, payload);

  return res.status(200).json(ApiResponse.success(updatedUser, 'Profile updated successfully'));
};

const changePassword = async (req: Request, res: Response) => {
  const payload: ChangePasswordBody = req.body;
  await userService.changePassword(req.user!.id, payload);

  return res.status(200).json(ApiResponse.success(null, 'Password changed successfully'));
};

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  logoutUser,
  getProfile,
  updateProfile,
  changePassword,
};
