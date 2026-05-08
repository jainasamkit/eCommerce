import { Router } from 'express';
import {
  createAddress,
  deleteAddress,
  getAddressById,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from '../../controllers/address.controller.ts';
import { authenticateUser, authoriseUser } from '../../middleware/auth.middleware.ts';
import { validateBody, validateParams } from '@ecommerce/shared-http';
import { UserRole } from '../../types/user.types.ts';
import {
  addressIdParamSchema,
  createAddressSchema,
  updateAddressSchema,
} from '../../validators/address.schema.ts';

const addressRouter = Router();

addressRouter.use(authenticateUser, authoriseUser([UserRole.USER]));

addressRouter.post('/', validateBody(createAddressSchema), createAddress);
addressRouter.get('/', getAddresses);
addressRouter.get('/:addressId', validateParams(addressIdParamSchema), getAddressById);
addressRouter.patch(
  '/:addressId',
  validateParams(addressIdParamSchema),
  validateBody(updateAddressSchema, { requireNonEmptyBody: true }),
  updateAddress,
);
addressRouter.patch(
  '/:addressId/default',
  validateParams(addressIdParamSchema),
  setDefaultAddress,
);
addressRouter.delete('/:addressId', validateParams(addressIdParamSchema), deleteAddress);

export { addressRouter };
