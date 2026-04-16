import type { ConsumeMessage } from 'amqplib';
import { MESSAGING } from '../config/messaging.ts';
import { getRabbitMQChannel } from '../config/rabbitmq.ts';

const startOrderCreatedConsumer = async (): Promise<void> => {
  const channel = await getRabbitMQChannel();

  await channel.assertExchange(MESSAGING.exchange, 'topic', { durable: true });
  await channel.assertQueue(MESSAGING.inventoryQueue, { durable: true });
  await channel.bindQueue(
    MESSAGING.inventoryQueue,
    MESSAGING.exchange,
    MESSAGING.orderCreatedRoutingKey,
  );

  await channel.consume(MESSAGING.inventoryQueue, (message: ConsumeMessage | null) => {
    if (!message) {
      return;
    }

    const payload = message.content.toString();
    console.log(`Received ${MESSAGING.orderCreatedRoutingKey}: ${payload}`);
    channel.ack(message);
  });
};

export { startOrderCreatedConsumer };
