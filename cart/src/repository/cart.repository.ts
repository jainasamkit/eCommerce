import { Types } from 'mongoose';
import { Cart } from '../model/cart.model.ts';
import type { CartDocument } from '../types/cart.types.ts';

const findCartByUserId = async (userId: string): Promise<CartDocument | null> => {
  return Cart.findOne({ userId }).lean();
};

const createEmptyCart = async (userId: string): Promise<CartDocument> => {
  return Cart.create({ userId: new Types.ObjectId(userId), items: [] });
};

const upsertCartItem = async (
  userId: string,
  productId: string,
  quantity: number,
  unitPrice: number,
): Promise<CartDocument> => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return Cart.create({
      userId: new Types.ObjectId(userId),
      items: [{ productId: new Types.ObjectId(productId), quantity, unitPrice }],
    });
  }

  const existingItem = cart.items.find((item) => String(item.productId) === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.unitPrice = unitPrice;
  } else {
    cart.items.push({ productId: new Types.ObjectId(productId), quantity, unitPrice });
  }

  return cart.save();
};

const setCartItemQuantity = async (
  userId: string,
  productId: string,
  quantity: number,
  unitPrice: number,
): Promise<CartDocument | null> => {
  return Cart.findOneAndUpdate(
    { userId, 'items.productId': productId },
    {
      $set: {
        'items.$.quantity': quantity,
        'items.$.unitPrice': unitPrice,
      },
    },
    { returnDocument: 'after' },
  ).lean();
};

const removeCartItem = async (userId: string, productId: string): Promise<CartDocument | null> => {
  return Cart.findOneAndUpdate(
    { userId },
    { $pull: { items: { productId: new Types.ObjectId(productId) } } },
    { returnDocument: 'after' },
  ).lean();
};

const clearCartItems = async (userId: string): Promise<CartDocument | null> => {
  return Cart.findOneAndUpdate(
    { userId },
    { $set: { items: [] } },
    { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true },
  ).lean();
};

export {
  clearCartItems,
  createEmptyCart,
  findCartByUserId,
  removeCartItem,
  setCartItemQuantity,
  upsertCartItem,
};
