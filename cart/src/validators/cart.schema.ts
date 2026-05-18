import { z } from 'zod';

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const productIdParamSchema = z
  .object({
    productId: objectIdSchema,
  })
  .strict();

const addCartItemSchema = z
  .object({
    productId: objectIdSchema,
    quantity: z.coerce.number().int().positive('Quantity must be at least 1'),
  })
  .strict();

const updateCartItemSchema = z
  .object({
    quantity: z.coerce.number().int().positive('Quantity must be at least 1'),
  })
  .strict();

type ProductIdParams = z.infer<typeof productIdParamSchema>;
type AddCartItemBody = z.infer<typeof addCartItemSchema>;
type UpdateCartItemBody = z.infer<typeof updateCartItemSchema>;

export { addCartItemSchema, productIdParamSchema, updateCartItemSchema };
export type { AddCartItemBody, ProductIdParams, UpdateCartItemBody };
