import type { Types } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

type UserRoleValue = `${UserRole}`;

type UserDocument = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: UserRoleValue;
  password: string;
  profilePic?: string | null;
  refreshToken?: string | null;
  passwordResetToken?: string | null;
  passwordResetTokenExpiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  profilePic?: string;
};

type UpdateUserProfileInput = {
  name?: string;
  profilePic?: string;
};

type UserLookupFilters = {
  _id?: string;
  email?: string;
  name?: string;
  role?: UserRoleValue;
};

type UserResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePic: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type RegisterUserResponse = UserResponse;

type LoginUserResponse = {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
};

type RefreshAccessTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

type ForgotPasswordResponse = {
  resetUrl: string | null;
};

type UserProfileResponse = UserDocument;

export type {
  UserRoleValue,
  UserDocument,
  CreateUserInput,
  UpdateUserProfileInput,
  UserLookupFilters,
  UserResponse,
  RegisterUserResponse,
  LoginUserResponse,
  RefreshAccessTokenResponse,
  ForgotPasswordResponse,
  UserProfileResponse,
};
