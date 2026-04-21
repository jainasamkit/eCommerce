import { MESSAGING } from '../config/messaging.ts';
import { getRabbitMQChannel } from '../config/rabbitmq.ts';
import type { InventoryRejectedEvent, InventoryReservedEvent } from '../types/messaging.types.ts';

const publishInventoryReserved = async (payload: InventoryReservedEvent): Promise<void> => {
  const channel = await getRabbitMQChannel();

  await channel.assertExchange(MESSAGING.exchange, 'topic', { durable: true });
  channel.publish(
    MESSAGING.exchange,
    MESSAGING.inventoryReservedRoutingKey,
    Buffer.from(JSON.stringify(payload)),
    { persistent: true },
  );
};

const publishInventoryRejected = async (payload: InventoryRejectedEvent): Promise<void> => {
  const channel = await getRabbitMQChannel();

  await channel.assertExchange(MESSAGING.exchange, 'topic', { durable: true });
  channel.publish(
    MESSAGING.exchange,
    MESSAGING.inventoryRejectedRoutingKey,
    Buffer.from(JSON.stringify(payload)),
    { persistent: true },
  );
};

export { publishInventoryReserved, publishInventoryRejected };
