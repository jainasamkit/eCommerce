import { createRabbitMQManager } from '@ecommerce/shared-messaging';
import { env } from '../config/env.ts';

const {
  closeRabbitMQ,
  connectRabbitMQ,
  consumeJson,
  publishJson,
} = createRabbitMQManager(env.RABBITMQ_URL);

export { closeRabbitMQ, connectRabbitMQ, consumeJson, publishJson };
