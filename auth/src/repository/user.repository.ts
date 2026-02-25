import { User } from '../model/user.model.ts';

const findUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

const findUserById = async (id: string) => {
  return User.findById(id);
};

const createUser = async (payload: {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  profilePic?: string;
}) => {
  return User.create(payload);
};

const updateUserById = async (
  id: string,
  payload: {
    name?: string;
    profilePic?: string;
  },
) => {
  return User.findByIdAndUpdate(id, payload, { returnDocument: 'after' });
};

const updateUserRefreshToken = async (id: string, refreshToken: string | null) => {
  return User.findByIdAndUpdate(id, { refreshToken }, { returnDocument: 'after' });
};

export { findUserByEmail, findUserById, createUser, updateUserById, updateUserRefreshToken };
