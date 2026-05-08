import { z } from 'zod';

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const orderIdParamSchema = z
  .object({
    orderId: objectIdSchema,
  })
  .strict();

const placeOrderSchema = z
  .object({
    productId: objectIdSchema,
    addressId: objectIdSchema,
    quantity: z.coerce.number().int().positive('Quantity must be at least 1'),
    paymentMethod: z.string().trim().optional(),
    notes: z.string().trim().optional(),
  })
  .strict();

type PlaceOrderBody = z.infer<typeof placeOrderSchema>;
type OrderIdParams = z.infer<typeof orderIdParamSchema>;

export { orderIdParamSchema, placeOrderSchema };
export type { PlaceOrderBody, OrderIdParams };
