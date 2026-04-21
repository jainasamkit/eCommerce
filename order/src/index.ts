import app from './app.ts';
import connectDB from './config/db.ts';
import { startInventoryResultConsumer } from './consumers/inventory-result.consumer.ts';
import { env } from './config/env.ts';
import { closeRabbitMQ, connectRabbitMQ } from './config/rabbitmq.ts';

await connectDB();
await connectRabbitMQ();
await startInventoryResultConsumer();

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
