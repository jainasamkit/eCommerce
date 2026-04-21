import type { ConsumeMessage } from 'amqplib';
import { MESSAGING } from '../config/messaging.ts';
import { getRabbitMQChannel } from '../config/rabbitmq.ts';
import type { OrderCreatedEvent } from '../types/messaging.types.ts';
import { handleOrderCreated } from '../services/inventory.service.ts';

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

    void (async () => {
      try {
        const payload = JSON.parse(message.content.toString()) as OrderCreatedEvent;
        await handleOrderCreated(payload);
        channel.ack(message);
      } catch (error) {
        console.error(`Failed to process ${MESSAGING.orderCreatedRoutingKey}`, error);
        channel.nack(message, false, false);
      }
    })();
  });
};

export { startOrderCreatedConsumer };
