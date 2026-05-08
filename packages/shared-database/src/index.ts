import type { Mongoose } from 'mongoose';

type MongooseModule = {
  connect: typeof import('mongoose').connect;
};

const connectMongoDB = async (
  mongoose: MongooseModule,
  mongoUri: string,
): Promise<void> => {
  try {
    const connection: Mongoose = await mongoose.connect(mongoUri);
    console.log('MongoDB connected:', connection.connection.host);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export { connectMongoDB };
