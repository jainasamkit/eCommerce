import mongoose from 'mongoose';
import { env } from './env.ts';

const { MONGO_URI } = env;

const connectDB = async () => {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
    process.exit(1);
  }
  try {
    const connection = await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected:', connection.connection.host);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default connectDB;
