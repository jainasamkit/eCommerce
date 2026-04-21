import type { ConsumeMessage } from 'amqplib';
import { MESSAGING } from '../config/messaging.ts';
import { getRabbitMQChannel } from '../config/rabbitmq.ts';
import { OrderStatus } from '../types/order.types.ts';
import type { InventoryRejectedEvent, InventoryReservedEvent } from '../types/messaging.types.ts';
import { updateOrderById } from '../repository/order.repository.ts';

const handleInventoryReserved = async (payload: InventoryReservedEvent): Promise<void> => {
  await updateOrderById(payload.orderId, { status: OrderStatus.CONFIRMED });
};

const handleInventoryRejected = async (payload: InventoryRejectedEvent): Promise<void> => {
  await updateOrderById(payload.orderId, { status: OrderStatus.CANCELLED });
};

const startInventoryResultConsumer = async (): Promise<void> => {
  const channel = await getRabbitMQChannel();

  await channel.assertExchange(MESSAGING.exchange, 'topic', { durable: true });
  await channel.assertQueue(MESSAGING.inventoryResultsQueue, { durable: true });
  await channel.bindQueue(
    MESSAGING.inventoryResultsQueue,
    MESSAGING.exchange,
    MESSAGING.inventoryReservedRoutingKey,
  );
  await channel.bindQueue(
    MESSAGING.inventoryResultsQueue,
    MESSAGING.exchange,
    MESSAGING.inventoryRejectedRoutingKey,
  );

  await channel.consume(MESSAGING.inventoryResultsQueue, (message: ConsumeMessage | null) => {
    if (!message) {
      return;
    }

    void (async () => {
      try {
        if (message.fields.routingKey === MESSAGING.inventoryReservedRoutingKey) {
          await handleInventoryReserved(
            JSON.parse(message.content.toString()) as InventoryReservedEvent,
          );
        }

        if (message.fields.routingKey === MESSAGING.inventoryRejectedRoutingKey) {
          await handleInventoryRejected(
            JSON.parse(message.content.toString()) as InventoryRejectedEvent,
          );
        }

        channel.ack(message);
      } catch (error) {
        console.error('Failed to process inventory result event', error);
        channel.nack(message, false, false);
      }
    })();
  });
};

export { startInventoryResultConsumer };
