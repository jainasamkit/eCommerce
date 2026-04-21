import { MESSAGING } from '../config/messaging.ts';
import { getRabbitMQChannel } from '../config/rabbitmq.ts';
import type { OrderCreatedEvent } from '../types/messaging.types.ts';

const publishOrderCreated = async (payload: OrderCreatedEvent): Promise<void> => {
  const channel = await getRabbitMQChannel();

  await channel.assertExchange(MESSAGING.exchange, 'topic', { durable: true });
  channel.publish(
    MESSAGING.exchange,
    MESSAGING.orderCreatedRoutingKey,
    Buffer.from(JSON.stringify(payload)),
    { persistent: true },
  );
};

export { publishOrderCreated };
