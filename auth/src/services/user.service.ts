import { ApiError } from '../utils/ApiError.ts';
import { createUser, findUserByEmail } from '../repository/user.repository.ts';
import type { RegisterUserBody } from '../validators/user.schema.ts';

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

export { registerUserService };
