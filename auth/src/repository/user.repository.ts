import { User } from '../model/user.model.ts';
import { ApiError } from '../utils/ApiError.ts';
import type {
  CreateUserInput,
  UserLookupFilters,
  UserDocument,
  UpdateUserProfileInput,
} from '../types/user.types.ts';
import { UserRole } from '../types/user.types.ts';

const findUser = async (payload: UserLookupFilters): Promise<UserDocument | null> => {
  const query: Record<string, unknown> = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );

  if (Object.keys(query).length === 0) {
    console.error('Repository usage error: findUser called without filters');
    throw ApiError.internal('Unable to fetch user');
  }

  return User.findOne(query).select('-password -refreshToken');
};

const findUserForLogin = async (email: string): Promise<UserDocument | null> => {
  return User.findOne({ email }).select('-refreshToken');
};

const findUserForRefreshToken = async (id: string): Promise<UserDocument | null> => {
  return User.findById(id).select('-password');
};

const findUserByIdWithPassword = async (id: string): Promise<UserDocument | null> => {
  return User.findById(id);
};

const createUser = async (payload: CreateUserInput): Promise<UserDocument> => {
  const createdUser = await User.create({
    ...payload,
    role: UserRole.USER,
  });
  const user = await User.findById(createdUser._id).select('-password -refreshToken');
  if (!user) {
    throw ApiError.internal('Unable to create user');
  }
  return user;
};

const updateUserById = async (
  id: string,
  payload: UpdateUserProfileInput,
): Promise<UserDocument | null> => {
  return User.findByIdAndUpdate(id, payload, { returnDocument: 'after' }).select('-password -refreshToken');
};

const updateUserRefreshToken = async (
  id: string,
  refreshToken: string | null,
): Promise<UserDocument | null> => {
  return User.findByIdAndUpdate(id, { refreshToken }, { returnDocument: 'after' }).select('-password -refreshToken');
};

const updateUserPasswordById = async (
  id: string,
  password: string,
): Promise<UserDocument | null> => {
  return User.findByIdAndUpdate(id, { password }, { returnDocument: 'after' }).select('-password -refreshToken');
};

export {
  findUser,
  findUserForLogin,
  findUserForRefreshToken,
  findUserByIdWithPassword,
  createUser,
  updateUserById,
  updateUserRefreshToken,
  updateUserPasswordById,
};
