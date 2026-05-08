import { publishJson } from '../broker.ts';
import { MESSAGE_BROKER, MESSAGE_EVENTS } from '../constants.ts';
import type { OrderCancelledEvent, OrderCreatedEvent } from '../../types/messaging.types.ts';

const publishOrderCreated = async (payload: OrderCreatedEvent): Promise<void> => {
  await publishJson(MESSAGE_BROKER.exchange, MESSAGE_EVENTS.orderCreatedRoutingKey, payload);
};

const publishOrderCancelled = async (payload: OrderCancelledEvent): Promise<void> => {
  await publishJson(MESSAGE_BROKER.exchange, MESSAGE_EVENTS.orderCancelledRoutingKey, payload);
};

export { publishOrderCreated, publishOrderCancelled };
