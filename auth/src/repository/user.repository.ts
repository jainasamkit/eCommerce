import { User } from '../model/user.model.ts';
import { ApiError } from '../utils/ApiError.ts';
import type {
  CreateUserPayload,
  CreateUserResult,
  FindUserPayload,
  FindUserResult,
  UpdateUserByIdResult,
  UpdateUserPayload,
  UpdateUserRefreshTokenResult,
} from '../types/user.types.ts';

const findUser = async (payload: FindUserPayload): Promise<FindUserResult> => {
  const query: Record<string, unknown> = {};

  if (payload.id !== undefined) {
    query._id = payload.id;
  }
  if (payload.email !== undefined) {
    query.email = payload.email;
  }
  if (payload.name !== undefined) {
    query.name = payload.name;
  }
  if (payload.role !== undefined) {
    query.role = payload.role;
  }

  if (Object.keys(query).length === 0) {
    console.error('Repository usage error: findUser called without filters');
    throw ApiError.internal('Unable to fetch user');
  }

  return User.findOne(query);
};

const createUser = async (payload: CreateUserPayload): Promise<CreateUserResult> => {
  return User.create({
    ...payload,
    role: 'user',
  });
};

const updateUserById = async (id: string, payload: UpdateUserPayload): Promise<UpdateUserByIdResult> => {
  return User.findByIdAndUpdate(id, payload, { returnDocument: 'after' });
};

const updateUserRefreshToken = async (
  id: string,
  refreshToken: string | null,
): Promise<UpdateUserRefreshTokenResult> => {
  return User.findByIdAndUpdate(id, { refreshToken }, { returnDocument: 'after' });
};

export { findUser, createUser, updateUserById, updateUserRefreshToken };
