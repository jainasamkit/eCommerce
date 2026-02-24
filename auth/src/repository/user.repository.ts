import { User } from '../model/user.model.ts';

const findUserByEmail = async (email: string) => {
  return User.findOne({ email });
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

export { findUserByEmail, createUser };
