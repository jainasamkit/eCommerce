const MESSAGING = {
  exchange: 'ecommerce.events',
  orderCreatedRoutingKey: 'order.created',
  inventoryReservedRoutingKey: 'inventory.reserved',
  inventoryRejectedRoutingKey: 'inventory.rejected',
  inventoryResultsQueue: 'order.inventory-results.queue',
} as const;

export { MESSAGING };
