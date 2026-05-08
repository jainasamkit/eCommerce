import { consumeJson } from '../broker.ts';
import { MESSAGE_BROKER, MESSAGE_EVENTS } from '../constants.ts';
import {
  findOrderById,
  updateOrderById,
  updateOrderByIdAndStatus,
} from '../../repository/order.repository.ts';
import { publishOrderCancelled } from '../producers/order.producer.ts';
import type { InventoryRejectedEvent, InventoryReservedEvent } from '../../types/messaging.types.ts';
import { OrderStatus } from '../../types/order.types.ts';

type InventoryResultEvent = InventoryRejectedEvent | InventoryReservedEvent;

const handleInventoryReserved = async (payload: InventoryReservedEvent): Promise<void> => {
  const updatedOrder = await updateOrderByIdAndStatus(payload.orderId, OrderStatus.PENDING, {
    status: OrderStatus.CONFIRMED,
  });

  if (updatedOrder) {
    return;
  }

  const order = await findOrderById(payload.orderId);
  if (order?.status === OrderStatus.CANCELLED) {
    await publishOrderCancelled({
      eventId: crypto.randomUUID(),
      orderId: payload.orderId,
      productId: payload.productId,
      quantity: payload.quantity,
    });
  }
};

const handleInventoryRejected = async (payload: InventoryRejectedEvent): Promise<void> => {
  await updateOrderById(payload.orderId, { status: OrderStatus.CANCELLED });
};

const startInventoryConsumer = async (): Promise<void> => {
  await consumeJson<InventoryResultEvent>({
    exchange: MESSAGE_BROKER.exchange,
    queue: MESSAGE_BROKER.inventoryResultsQueue,
    routingKeys: [
      MESSAGE_EVENTS.inventoryReservedRoutingKey,
      MESSAGE_EVENTS.inventoryRejectedRoutingKey,
    ],
    onMessage: async (payload, routingKey) => {
      if (routingKey === MESSAGE_EVENTS.inventoryReservedRoutingKey) {
        await handleInventoryReserved(payload as InventoryReservedEvent);
        return;
      }

      if (routingKey === MESSAGE_EVENTS.inventoryRejectedRoutingKey) {
        await handleInventoryRejected(payload as InventoryRejectedEvent);
      }
    },
    onError: (error) => {
      console.error('Failed to process inventory result event', error);
    },
  });
};

export { startInventoryConsumer };
