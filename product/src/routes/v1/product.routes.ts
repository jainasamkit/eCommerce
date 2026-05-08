import { Router } from 'express';
import { getProductById, getProducts } from '../../controllers/product.controller.ts';
import { validateParams, validateQuery } from '@ecommerce/shared-http';
import { productIdParamSchema, productQuerySchema } from '../../validators/product.schema.ts';

const productRouter = Router();

productRouter.get('/', validateQuery(productQuerySchema), getProducts);
productRouter.get('/:productId', validateParams(productIdParamSchema), getProductById);

export { productRouter };
