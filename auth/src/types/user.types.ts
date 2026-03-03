import type { Types } from 'mongoose';

type UserRole = 'user' | 'admin';

type UserDocument = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  profilePic?: string | null;
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  profilePic?: string;
};

type UpdateUserPayload = {
  name?: string;
  profilePic?: string;
};

type RegisterUserServicePayload = {
  name: string;
  email: string;
  password: string;
  profilePic?: string;
};

type UpdateProfileServicePayload = {
  name?: string;
  profilePic?: string;
};

type FindUserPayload = {
  id?: string;
  email?: string;
  name?: string;
  role?: UserRole;
};

type FindUserResult = UserDocument | null;
type CreateUserResult = UserDocument;
type UpdateUserByIdResult = UserDocument | null;
type UpdateUserRefreshTokenResult = UserDocument | null;

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

type GetProfileResponse = UserResponse;

type UpdateProfileResponse = UserResponse;

export type {
  UserRole,
  UserDocument,
  CreateUserPayload,
  UpdateUserPayload,
  RegisterUserServicePayload,
  UpdateProfileServicePayload,
  FindUserPayload,
  FindUserResult,
  CreateUserResult,
  UpdateUserByIdResult,
  UpdateUserRefreshTokenResult,
  UserResponse,
  RegisterUserResponse,
  LoginUserResponse,
  RefreshAccessTokenResponse,
  GetProfileResponse,
  UpdateProfileResponse,
};
