import { MESSAGING } from '../config/messaging.ts';
import { getRabbitMQChannel } from '../config/rabbitmq.ts';

const publishOrderCreated = async (payload: Record<string, unknown>): Promise<void> => {
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
