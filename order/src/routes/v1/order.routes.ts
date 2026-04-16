import { Router } from 'express';
import {
  cancelOrder,
  getMyOrders,
  getOrderById,
  placeOrder,
  publishOrderCreatedTest,
} from '../../controllers/order.controller.ts';
import { authenticateUser, authoriseUser } from '../../middleware/auth.middleware.ts';
import { validateBody, validateParams } from '../../middleware/validate.middleware.ts';
import { UserRole } from '../../types/user.types.ts';
import { orderIdParamSchema, placeOrderSchema } from '../../validators/order.schema.ts';

const orderRouter = Router();
orderRouter.post('/publish-test', publishOrderCreatedTest);

orderRouter.use(authenticateUser, authoriseUser([UserRole.USER]));

orderRouter.post('/', validateBody(placeOrderSchema), placeOrder);
orderRouter.get('/', getMyOrders);
orderRouter.get('/:orderId', validateParams(orderIdParamSchema), getOrderById);
orderRouter.patch('/:orderId/cancel', validateParams(orderIdParamSchema), cancelOrder);

export { orderRouter };
