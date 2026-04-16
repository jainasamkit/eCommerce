import app from './app.ts';
import connectDB from './config/db.ts';
import { env } from './config/env.ts';
import { startOrderCreatedConsumer } from './consumers/order-created.consumer.ts';
import { closeRabbitMQ, connectRabbitMQ } from './config/rabbitmq.ts';

await connectDB();
await connectRabbitMQ();
await startOrderCreatedConsumer();

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
