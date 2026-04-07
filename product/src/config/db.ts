import mongoose, { type Mongoose } from 'mongoose';
import { env } from './env.ts';

const connectDB = async (): Promise<void> => {
  try {
    const connection: Mongoose = await mongoose.connect(env.MONGO_URI);
    console.log('MongoDB connected:', connection.connection.host);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default connectDB;
