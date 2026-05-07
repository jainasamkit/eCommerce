import app from './app.ts';
import { env } from './config/env.ts';
import { startOrderConsumer } from './messaging/consumers/order.consumer.ts';
import { closeRabbitMQ, connectRabbitMQ } from './messaging/broker.ts';
import mongoose from 'mongoose';
import { connectMongoDB } from '@ecommerce/shared-database';

await connectMongoDB(mongoose, env.MONGO_URI);
await connectRabbitMQ();
await startOrderConsumer();

app.listen(env.PORT, () => {
  console.log(`Product service running on port ${env.PORT}`);
});

process.on('SIGINT', async () => {
  await closeRabbitMQ();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeRabbitMQ();
  process.exit(0);
});
