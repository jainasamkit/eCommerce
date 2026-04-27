import mongoose from 'mongoose';
import { connectMongoDB } from '@ecommerce/shared-database';
import { env } from './env.ts';

const connectDB = () => connectMongoDB(mongoose, env.MONGO_URI);

export default connectDB;
