import type { Request, Response } from 'express';
import { ApiResponse } from '@ecommerce/shared-http';
import * as cartService from '../services/cart.service.ts';
import type { AddCartItemBody, UpdateCartItemBody } from '../validators/cart.schema.ts';

const getMyCart = async (req: Request, res: Response) => {
  const cart = await cartService.getMyCart(req.user!.id);
  return res.status(200).json(ApiResponse.success(cart, 'Cart fetched successfully'));
};

const addItemToCart = async (req: Request, res: Response) => {
  const payload: AddCartItemBody = req.body;
  const cart = await cartService.addItemToCart(req.user!.id, payload);

  return res.status(201).json(ApiResponse.created(cart, 'Cart item added successfully'));
};

const updateCartItem = async (req: Request, res: Response) => {
  const payload: UpdateCartItemBody = req.body;
  const { productId } = req.params as { productId: string };
  const cart = await cartService.updateCartItem(req.user!.id, productId, payload);

  return res.status(200).json(ApiResponse.success(cart, 'Cart item updated successfully'));
};

const removeItemFromCart = async (req: Request, res: Response) => {
  const { productId } = req.params as { productId: string };
  const cart = await cartService.removeItemFromCart(req.user!.id, productId);

  return res.status(200).json(ApiResponse.success(cart, 'Cart item removed successfully'));
};

const clearCart = async (req: Request, res: Response) => {
  const cart = await cartService.clearCart(req.user!.id);
  return res.status(200).json(ApiResponse.success(cart, 'Cart cleared successfully'));
};

export { addItemToCart, clearCart, getMyCart, removeItemFromCart, updateCartItem };
