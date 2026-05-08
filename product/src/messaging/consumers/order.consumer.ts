import { z } from 'zod';
import { consumeJson } from '../broker.ts';
import { MESSAGE_BROKER, MESSAGE_EVENTS } from '../constants.ts';
import { handleOrderCancelled, handleOrderCreated } from '../../services/inventory.service.ts';
import type { OrderCancelledEvent, OrderCreatedEvent } from '../../types/messaging.types.ts';

type OrderEvent = OrderCancelledEvent | OrderCreatedEvent;

const orderEventSchema = z.object({
  eventId: z.string().trim().min(1),
  orderId: z.string().trim().min(1),
  productId: z.string().trim().min(1),
  quantity: z.number().int().positive(),
});

const startOrderConsumer = async (): Promise<void> => {
  await consumeJson<OrderEvent>({
    exchange: MESSAGE_BROKER.exchange,
    queue: MESSAGE_BROKER.inventoryQueue,
    routingKeys: [MESSAGE_EVENTS.orderCreatedRoutingKey, MESSAGE_EVENTS.orderCancelledRoutingKey],
    onMessage: async (payload, routingKey) => {
      const parsedPayload = orderEventSchema.parse(payload);

      if (routingKey === MESSAGE_EVENTS.orderCancelledRoutingKey) {
        await handleOrderCancelled(parsedPayload);
        return;
      }

      if (routingKey === MESSAGE_EVENTS.orderCreatedRoutingKey) {
        await handleOrderCreated(parsedPayload);
      }
    },
    onError: (error, routingKey) => {
      console.error(`Failed to process ${routingKey}`, error);
    },
  });
};

export { startOrderConsumer };
