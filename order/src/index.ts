import app from './app.ts';
import { startInventoryConsumer } from './messaging/consumers/inventory.consumer.ts';
import { env } from './config/env.ts';
import { closeRabbitMQ, connectRabbitMQ } from './messaging/broker.ts';
import mongoose from 'mongoose';
import { connectMongoDB } from '@ecommerce/shared-database';

await connectMongoDB(mongoose, env.MONGO_URI);
await connectRabbitMQ();
await startInventoryConsumer();

app.listen(env.PORT, () => {
  console.log(`Order service running on port ${env.PORT}`);
});

process.on('SIGINT', async () => {
  await closeRabbitMQ();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeRabbitMQ();
  process.exit(0);
});
