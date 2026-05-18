import { isValidObjectId } from 'mongoose';
import { ApiError } from '@ecommerce/shared-http';
import { getProductById } from '../clients/product.client.ts';
import {
  clearCartItems,
  createEmptyCart,
  findCartByUserId,
  removeCartItem,
  setCartItemQuantity,
  upsertCartItem,
} from '../repository/cart.repository.ts';
import type { CartDocument, CartResponse } from '../types/cart.types.ts';
import type { AddCartItemBody, UpdateCartItemBody } from '../validators/cart.schema.ts';

const toCartResponse = (cart: CartDocument): CartResponse => {
  const items = cart.items.map((item) => {
    const subtotal = Number((item.unitPrice * item.quantity).toFixed(2));

    return {
      productId: String(item.productId),
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal,
    };
  });

  return {
    id: String(cart._id),
    userId: String(cart.userId),
    items,
    totalItems: items.reduce((total, item) => total + item.quantity, 0),
    totalAmount: Number(items.reduce((total, item) => total + item.subtotal, 0).toFixed(2)),
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
  };
};

const getMyCart = async (userId: string): Promise<CartResponse> => {
  const cart = (await findCartByUserId(userId)) ?? (await createEmptyCart(userId));
  return toCartResponse(cart);
};

const addItemToCart = async (userId: string, payload: AddCartItemBody): Promise<CartResponse> => {
  const product = await getProductById(payload.productId);
  if (product.quantity < payload.quantity) {
    throw ApiError.badRequest('Insufficient product quantity available');
  }

  const unitPrice = Number(product.price.toFixed(2));
  const cart = await upsertCartItem(userId, payload.productId, payload.quantity, unitPrice);

  return toCartResponse(cart);
};

const updateCartItem = async (
  userId: string,
  productId: string,
  payload: UpdateCartItemBody,
): Promise<CartResponse> => {
  if (!isValidObjectId(productId)) {
    throw ApiError.badRequest('Invalid product id');
  }

  const product = await getProductById(productId);
  if (product.quantity < payload.quantity) {
    throw ApiError.badRequest('Insufficient product quantity available');
  }

  const unitPrice = Number(product.price.toFixed(2));
  const cart = await setCartItemQuantity(userId, productId, payload.quantity, unitPrice);
  if (!cart) {
    throw ApiError.notFound('Cart item not found');
  }

  return toCartResponse(cart);
};

const removeItemFromCart = async (userId: string, productId: string): Promise<CartResponse> => {
  if (!isValidObjectId(productId)) {
    throw ApiError.badRequest('Invalid product id');
  }

  const cart = await removeCartItem(userId, productId);
  if (!cart) {
    throw ApiError.notFound('Cart not found');
  }

  return toCartResponse(cart);
};

const clearCart = async (userId: string): Promise<CartResponse> => {
  const cart = await clearCartItems(userId);
  if (!cart) {
    throw ApiError.notFound('Cart not found');
  }

  return toCartResponse(cart);
};

export { addItemToCart, clearCart, getMyCart, removeItemFromCart, updateCartItem };
