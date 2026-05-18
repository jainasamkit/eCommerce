import { Router } from 'express';
import { validateBody, validateParams } from '@ecommerce/shared-http';
import {
  addItemToCart,
  clearCart,
  getMyCart,
  removeItemFromCart,
  updateCartItem,
} from '../../controllers/cart.controller.ts';
import { authenticateUser, authoriseUser } from '../../middleware/auth.middleware.ts';
import { UserRole } from '../../types/user.types.ts';
import {
  addCartItemSchema,
  productIdParamSchema,
  updateCartItemSchema,
} from '../../validators/cart.schema.ts';

const cartRouter = Router();

cartRouter.use(authenticateUser, authoriseUser([UserRole.USER]));
cartRouter.get('/', getMyCart);
cartRouter.post('/items', validateBody(addCartItemSchema), addItemToCart);
cartRouter.patch(
  '/items/:productId',
  validateParams(productIdParamSchema),
  validateBody(updateCartItemSchema),
  updateCartItem,
);
cartRouter.delete('/items/:productId', validateParams(productIdParamSchema), removeItemFromCart);
cartRouter.delete('/', clearCart);

export { cartRouter };
