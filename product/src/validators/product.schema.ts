import { z } from 'zod';

const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().min(1).optional(),
  brand: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
});

const productIdParamSchema = z.object({
  productId: z.string().trim().min(1, 'productId is required'),
});

type ProductParams = z.infer<typeof productIdParamSchema>;

export { productQuerySchema, productIdParamSchema };
export type { ProductParams };
