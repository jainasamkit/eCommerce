import mongoose, { type Mongoose } from 'mongoose';
import { env } from './env.ts';

const { MONGO_URI } = env;

const connectDB = async (): Promise<void> => {
  if (!MONGO_URI) {
    console.error('Database configuration error: MONGO_URI is not configured');
    throw new Error('Database configuration error');
  }
  try {
    const connection: Mongoose = await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected:', connection.connection.host);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default connectDB;
