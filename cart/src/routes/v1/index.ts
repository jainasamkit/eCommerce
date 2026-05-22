import { Router } from 'express';
import { cartRouter } from './cart.routes.ts';

const v1Router = Router();

v1Router.use('/cart', cartRouter);

export { v1Router };
