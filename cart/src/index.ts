import mongoose from 'mongoose';
import { connectMongoDB } from '@ecommerce/shared-database';
import app from './app.ts';
import { env } from './config/env.ts';

await connectMongoDB(mongoose, env.MONGO_URI);

app.listen(env.PORT, () => {
  console.log(`Cart service running on port ${env.PORT}`);
});
