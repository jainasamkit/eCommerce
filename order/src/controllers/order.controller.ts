import type { Request, Response } from 'express';
import { ApiResponse } from '@ecommerce/shared-http';
import { publishOrderCreated } from '../services/order-message.service.ts';
import * as orderService from '../services/order.service.ts';
import type { PlaceOrderBody } from '../validators/order.schema.ts';

const placeOrder = async (req: Request, res: Response) => {
  const payload: PlaceOrderBody = req.body;
  const order = await orderService.placeOrder(req.user!.id, payload);

  return res.status(201).json(ApiResponse.created(order, 'Order placed successfully'));
};

const getMyOrders = async (req: Request, res: Response) => {
  const orders = await orderService.getMyOrders(req.user!.id);
  return res.status(200).json(ApiResponse.success(orders, 'Orders fetched successfully'));
};

const getOrderById = async (req: Request, res: Response) => {
  const { orderId } = req.params as { orderId: string };
  const order = await orderService.getOrderById(orderId, req.user!.id);
  return res.status(200).json(ApiResponse.success(order, 'Order fetched successfully'));
};

const cancelOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params as { orderId: string };
  const order = await orderService.cancelOrder(orderId, req.user!.id);
  return res.status(200).json(ApiResponse.success(order, 'Order cancelled successfully'));
};

const publishOrderCreatedTest = async (_req: Request, res: Response) => {
  const payload = {
    eventId: crypto.randomUUID(),
    orderId: crypto.randomUUID(),
    productId: 'test-product-id',
    quantity: 1,
  };

  await publishOrderCreated(payload);
  return res.status(202).json(ApiResponse.success(payload, 'Test order.created event published successfully'));
};

export { placeOrder, getMyOrders, getOrderById, cancelOrder, publishOrderCreatedTest };
