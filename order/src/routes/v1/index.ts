import { Router } from 'express';
import { addressRouter } from './address.routes.ts';
import { orderRouter } from './order.routes.ts';

const v1Router = Router();

v1Router.use('/addresses', addressRouter);
v1Router.use('/orders', orderRouter);

export { v1Router };
