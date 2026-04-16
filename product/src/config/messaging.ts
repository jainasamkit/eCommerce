const MESSAGING = {
  exchange: 'ecommerce.events',
  orderCreatedRoutingKey: 'order.created',
  inventoryQueue: 'product.inventory.queue',
} as const;

export { MESSAGING };
