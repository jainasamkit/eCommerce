import {
  decrementProductQuantity,
  findProductById,
  incrementProductQuantity,
} from '../repository/product.repository.ts';
import type { OrderCancelledEvent, OrderCreatedEvent } from '../types/messaging.types.ts';
import {
  publishInventoryRejected,
  publishInventoryReserved,
} from '../messaging/producers/inventory.producer.ts';

const handleOrderCreated = async (payload: OrderCreatedEvent): Promise<void> => {
  const product = await findProductById(payload.productId);

  if (!product) {
    await publishInventoryRejected({
      eventId: payload.eventId,
      orderId: payload.orderId,
      productId: payload.productId,
      quantity: payload.quantity,
      reason: 'Product not found',
    });
    return;
  }

  const updatedProduct = await decrementProductQuantity(payload.productId, payload.quantity);

  if (!updatedProduct) {
    await publishInventoryRejected({
      eventId: payload.eventId,
      orderId: payload.orderId,
      productId: payload.productId,
      quantity: payload.quantity,
      reason: 'Insufficient product quantity available',
    });
    return;
  }

  await publishInventoryReserved({
    eventId: payload.eventId,
    orderId: payload.orderId,
    productId: payload.productId,
    quantity: payload.quantity,
    remainingQuantity: updatedProduct.quantity,
  });
};

const handleOrderCancelled = async (payload: OrderCancelledEvent): Promise<void> => {
  await incrementProductQuantity(payload.productId, payload.quantity);
};

export { handleOrderCreated, handleOrderCancelled };
