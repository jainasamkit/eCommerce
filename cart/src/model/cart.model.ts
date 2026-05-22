import { Schema, model } from 'mongoose';
import type { CartDocument } from '../types/cart.types.ts';

const cartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const cartSchema = new Schema<CartDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  { timestamps: true },
);

cartSchema.index({ userId: 1, 'items.productId': 1 });

export const Cart = model<CartDocument>('Cart', cartSchema);
