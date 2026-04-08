import type { Types } from 'mongoose';

type AddressModelShape = {
  userId: Types.ObjectId;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string | null;
  addressType?: string | null;
  isDefault: boolean;
};

type AddressDocument = AddressModelShape & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type { AddressModelShape, AddressDocument };
