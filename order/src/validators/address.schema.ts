import { z } from 'zod';

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid address id');

const addressIdParamSchema = z
  .object({
    addressId: objectIdSchema,
  })
  .strict();

const baseAddressSchema = {
  fullName: z.string().trim().min(2, 'Full name is required'),
  phoneNumber: z.string().trim().min(6, 'Phone number is required'),
  addressLine1: z.string().trim().min(3, 'Address line 1 is required'),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().min(2, 'City is required'),
  state: z.string().trim().min(2, 'State is required'),
  postalCode: z.string().trim().min(3, 'Postal code is required'),
  country: z.string().trim().min(2, 'Country is required'),
  landmark: z.string().trim().optional(),
  addressType: z.string().trim().optional(),
  isDefault: z.boolean().optional(),
};

const createAddressSchema = z.object(baseAddressSchema).strict();

const updateAddressSchema = z
  .object({
    fullName: baseAddressSchema.fullName.optional(),
    phoneNumber: baseAddressSchema.phoneNumber.optional(),
    addressLine1: baseAddressSchema.addressLine1.optional(),
    addressLine2: z.string().trim().optional(),
    city: baseAddressSchema.city.optional(),
    state: baseAddressSchema.state.optional(),
    postalCode: baseAddressSchema.postalCode.optional(),
    country: baseAddressSchema.country.optional(),
    landmark: z.string().trim().optional(),
    addressType: z.string().trim().optional(),
    isDefault: z.boolean().optional(),
  })
  .strict();

type CreateAddressBody = z.infer<typeof createAddressSchema>;
type UpdateAddressBody = z.infer<typeof updateAddressSchema>;
type AddressIdParams = z.infer<typeof addressIdParamSchema>;

export { addressIdParamSchema, createAddressSchema, updateAddressSchema };
export type { CreateAddressBody, UpdateAddressBody, AddressIdParams };
