const MESSAGING = {
  exchange: 'ecommerce.events',
  orderCreatedRoutingKey: 'order.created',
  inventoryReservedRoutingKey: 'inventory.reserved',
  inventoryRejectedRoutingKey: 'inventory.rejected',
  inventoryQueue: 'product.inventory.queue',
} as const;

export { MESSAGING };
