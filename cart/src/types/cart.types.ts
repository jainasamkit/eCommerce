import type { Types } from 'mongoose';

type CartItemModelShape = {
  productId: Types.ObjectId;
  quantity: number;
  unitPrice: number;
};

type CartModelShape = {
  userId: Types.ObjectId;
  items: CartItemModelShape[];
};

type CartDocument = CartModelShape & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

type CartItemResponse = {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

type CartResponse = {
  id: string;
  userId: string;
  items: CartItemResponse[];
  totalItems: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type { CartDocument, CartItemModelShape, CartModelShape, CartItemResponse, CartResponse };
