import { publishJson } from '../broker.ts';
import { MESSAGE_BROKER, MESSAGE_EVENTS } from '../constants.ts';
import type { InventoryRejectedEvent, InventoryReservedEvent } from '../../types/messaging.types.ts';

const publishInventoryReserved = async (payload: InventoryReservedEvent): Promise<void> => {
  await publishJson(MESSAGE_BROKER.exchange, MESSAGE_EVENTS.inventoryReservedRoutingKey, payload);
};

const publishInventoryRejected = async (payload: InventoryRejectedEvent): Promise<void> => {
  await publishJson(MESSAGE_BROKER.exchange, MESSAGE_EVENTS.inventoryRejectedRoutingKey, payload);
};

export { publishInventoryReserved, publishInventoryRejected };
