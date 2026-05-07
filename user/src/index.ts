import app from './app.ts';
import { env } from './config/env.ts';
import mongoose from 'mongoose';
import { connectMongoDB } from '@ecommerce/shared-database';

await connectMongoDB(mongoose, env.MONGO_URI);

app.listen(env.PORT, () => {
  console.log(`User service running on port ${env.PORT}`);
});
