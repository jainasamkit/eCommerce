import { z } from 'zod';

const splitCommaSeparatedValues = (value: unknown): string[] | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const values = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return values.length > 0 ? values : undefined;
};

const specificationFiltersSchema = z
  .record(z.string().trim().min(1), z.string().trim().min(1))
  .optional();

const productQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().min(1).optional(),
    brand: z.preprocess(
      splitCommaSeparatedValues,
      z.array(z.string().trim().min(1)).optional(),
    ),
    category: z.preprocess(
      splitCommaSeparatedValues,
      z.array(z.string().trim().min(1)).optional(),
    ),
    specifications: z.preprocess((value) => {
      if (typeof value !== 'string') {
        return undefined;
      }

      const entries = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => item.split(':').map((part) => part.trim()))
        .filter(
          (parts): parts is [string, string] =>
            parts.length === 2 && Boolean(parts[0]) && Boolean(parts[1]),
        );

      if (entries.length === 0) {
        return undefined;
      }

      return Object.fromEntries(entries);
    }, specificationFiltersSchema),
    specificationKey: z.string().trim().min(1).optional(),
    specificationValue: z.string().trim().min(1).optional(),
    sortBy: z.enum(['createdAt', 'price', 'name']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
  .refine(
    (data) =>
      ((!data.specificationKey && !data.specificationValue) ||
        (Boolean(data.specificationKey) && Boolean(data.specificationValue))) &&
      !(data.specifications && (data.specificationKey || data.specificationValue)),
    {
      message:
        'Use either specificationKey/specificationValue together or specifications, but not both',
      path: ['specificationKey'],
    },
  );

const productIdParamSchema = z.object({
  productId: z.string().trim().min(1, 'productId is required'),
});

type ProductParams = z.infer<typeof productIdParamSchema>;

export { productQuerySchema, productIdParamSchema };
export type { ProductParams };
