import { User } from '../model/user.model.ts';
import { ApiError } from '../utils/ApiError.ts';
import type {
  CreateUserInput,
  UserLookupFilters,
  UserDocument,
  UpdateUserProfileInput,
} from '../types/user.types.ts';
import { UserRole } from '../types/user.types.ts';

const PUBLIC_USER_PROJECTION =
  '-password -refreshToken -passwordResetToken -passwordResetTokenExpiresAt';

const findUser = async (payload: UserLookupFilters): Promise<UserDocument | null> => {
  const query: Record<string, unknown> = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );

  if (Object.keys(query).length === 0) {
    console.error('Repository usage error: findUser called without filters');
    throw ApiError.internal('Unable to fetch user');
  }

  return User.findOne(query).select(PUBLIC_USER_PROJECTION);
};

const findUserForLogin = async (email: string): Promise<UserDocument | null> => {
  return User.findOne({ email }).select('-refreshToken -passwordResetToken -passwordResetTokenExpiresAt');
};

const findUserForRefreshToken = async (id: string): Promise<UserDocument | null> => {
  return User.findById(id).select('-password -passwordResetToken -passwordResetTokenExpiresAt');
};

const findUserByIdWithPassword = async (id: string): Promise<UserDocument | null> => {
  return User.findById(id);
};

const findUserByEmailWithSensitiveFields = async (email: string): Promise<UserDocument | null> => {
  return User.findOne({ email });
};

const findUserByResetToken = async (passwordResetToken: string): Promise<UserDocument | null> => {
  return User.findOne({
    passwordResetToken,
    passwordResetTokenExpiresAt: { $gt: new Date() },
  });
};

const createUser = async (payload: CreateUserInput): Promise<UserDocument> => {
  const createdUser = await User.create({
    ...payload,
    role: UserRole.USER,
  });
  const user = await User.findById(createdUser._id).select(PUBLIC_USER_PROJECTION);
  if (!user) {
    throw ApiError.internal('Unable to create user');
  }
  return user;
};

const updateUserById = async (
  id: string,
  payload: UpdateUserProfileInput,
): Promise<UserDocument | null> => {
  return User.findByIdAndUpdate(id, payload, { returnDocument: 'after' }).select(PUBLIC_USER_PROJECTION);
};

const updateUserRefreshToken = async (
  id: string,
  refreshToken: string | null,
): Promise<UserDocument | null> => {
  return User.findByIdAndUpdate(id, { refreshToken }, { returnDocument: 'after' }).select(PUBLIC_USER_PROJECTION);
};

const updateUserPasswordResetToken = async (
  id: string,
  passwordResetToken: string | null,
  passwordResetTokenExpiresAt: Date | null,
): Promise<UserDocument | null> => {
  return User.findByIdAndUpdate(
    id,
    { passwordResetToken, passwordResetTokenExpiresAt },
    { returnDocument: 'after' },
  ).select(PUBLIC_USER_PROJECTION);
};

const updateUserPasswordById = async (
  id: string,
  password: string,
): Promise<UserDocument | null> => {
  return User.findByIdAndUpdate(id, { password }, { returnDocument: 'after' }).select(PUBLIC_USER_PROJECTION);
};

const resetUserPasswordById = async (
  id: string,
  password: string,
): Promise<UserDocument | null> => {
  return User.findByIdAndUpdate(
    id,
    {
      password,
      refreshToken: null,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
    },
    { returnDocument: 'after' },
  ).select(PUBLIC_USER_PROJECTION);
};

export {
  PUBLIC_USER_PROJECTION,
  findUser,
  findUserForLogin,
  findUserForRefreshToken,
  findUserByIdWithPassword,
  findUserByEmailWithSensitiveFields,
  findUserByResetToken,
  createUser,
  updateUserById,
  updateUserRefreshToken,
  updateUserPasswordResetToken,
  updateUserPasswordById,
  resetUserPasswordById,
};
