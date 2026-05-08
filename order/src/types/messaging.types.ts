type OrderCreatedEvent = {
  eventId: string;
  orderId: string;
  productId: string;
  quantity: number;
};

type OrderCancelledEvent = {
  eventId: string;
  orderId: string;
  productId: string;
  quantity: number;
};

type InventoryReservedEvent = {
  eventId: string;
  orderId: string;
  productId: string;
  quantity: number;
  remainingQuantity: number;
};

type InventoryRejectedEvent = {
  eventId: string;
  orderId: string;
  productId: string;
  quantity: number;
  reason: string;
};

export type {
  OrderCreatedEvent,
  OrderCancelledEvent,
  InventoryReservedEvent,
  InventoryRejectedEvent,
};
