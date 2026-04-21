import { z } from 'zod';
import { decrementProductQuantity, findProductById } from '../repository/product.repository.ts';
import type { OrderCreatedEvent } from '../types/messaging.types.ts';
import { publishInventoryRejected, publishInventoryReserved } from './inventory-message.service.ts';

const orderCreatedEventSchema = z.object({
  eventId: z.string().trim().min(1),
  orderId: z.string().trim().min(1),
  productId: z.string().trim().min(1),
  quantity: z.number().int().positive(),
});

const handleOrderCreated = async (payload: OrderCreatedEvent): Promise<void> => {
  const parsedPayload = orderCreatedEventSchema.parse(payload);
  const product = await findProductById(parsedPayload.productId);

  if (!product) {
    await publishInventoryRejected({
      eventId: parsedPayload.eventId,
      orderId: parsedPayload.orderId,
      productId: parsedPayload.productId,
      quantity: parsedPayload.quantity,
      reason: 'Product not found',
    });
    return;
  }

  const updatedProduct = await decrementProductQuantity(
    parsedPayload.productId,
    parsedPayload.quantity,
  );

  if (!updatedProduct) {
    await publishInventoryRejected({
      eventId: parsedPayload.eventId,
      orderId: parsedPayload.orderId,
      productId: parsedPayload.productId,
      quantity: parsedPayload.quantity,
      reason: 'Insufficient product quantity available',
    });
    return;
  }

  await publishInventoryReserved({
    eventId: parsedPayload.eventId,
    orderId: parsedPayload.orderId,
    productId: parsedPayload.productId,
    quantity: parsedPayload.quantity,
    remainingQuantity: updatedProduct.quantity,
  });
};

export { handleOrderCreated };
