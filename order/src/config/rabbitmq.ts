import { createRabbitMQManager } from '@ecommerce/shared-messaging';
import { env } from './env.ts';

const { closeRabbitMQ, connectRabbitMQ, getRabbitMQChannel } = createRabbitMQManager(
  env.RABBITMQ_URL,
);

export { connectRabbitMQ, closeRabbitMQ, getRabbitMQChannel };
