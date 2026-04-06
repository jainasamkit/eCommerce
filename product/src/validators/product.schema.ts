import { z } from 'zod';

const productQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().min(1).optional(),
    brand: z.string().trim().min(1).optional(),
    category: z.string().trim().min(1).optional(),
    specificationKey: z.string().trim().min(1).optional(),
    specificationValue: z.string().trim().min(1).optional(),
    sortBy: z.enum(['createdAt', 'price', 'name']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
  .refine(
    (data) =>
      (!data.specificationKey && !data.specificationValue) ||
      (Boolean(data.specificationKey) && Boolean(data.specificationValue)),
    {
      message: 'specificationKey and specificationValue must be provided together',
      path: ['specificationKey'],
    },
  );

const productIdParamSchema = z.object({
  productId: z.string().trim().min(1, 'productId is required'),
});

type ProductParams = z.infer<typeof productIdParamSchema>;

export { productQuerySchema, productIdParamSchema };
export type { ProductParams };
