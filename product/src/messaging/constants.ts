import { env } from '../config/env.ts';

const MESSAGE_BROKER = {
  exchange: env.RABBITMQ_EXCHANGE,
  inventoryQueue: env.RABBITMQ_INVENTORY_QUEUE,
} as const;

const MESSAGE_EVENTS = {
  orderCreatedRoutingKey: 'order.created',
  orderCancelledRoutingKey: 'order.cancelled',
  inventoryReservedRoutingKey: 'inventory.reserved',
  inventoryRejectedRoutingKey: 'inventory.rejected',
} as const;

export { MESSAGE_BROKER, MESSAGE_EVENTS };
