import { Router } from 'express';
import { productRouter } from './product.routes.ts';

const v1Router = Router();

v1Router.use('/products', productRouter);

export { v1Router };
