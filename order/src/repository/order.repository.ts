import { Order } from '../model/order.model.ts';
import type { OrderDocument, OrderModelShape } from '../types/order.types.ts';

const createOrder = async (payload: OrderModelShape): Promise<OrderDocument> => {
  return Order.create(payload);
};

const findOrdersByUserId = async (userId: string): Promise<OrderDocument[]> => {
  return Order.find({ userId }).sort({ createdAt: -1 });
};

const findOrderByIdAndUserId = async (
  orderId: string,
  userId: string,
): Promise<OrderDocument | null> => {
  return Order.findOne({ _id: orderId, userId });
};

const updateOrderByIdAndUserId = async (
  orderId: string,
  userId: string,
  payload: Partial<OrderModelShape>,
): Promise<OrderDocument | null> => {
  return Order.findOneAndUpdate({ _id: orderId, userId }, payload, {
    returnDocument: 'after',
  });
};

export { createOrder, findOrdersByUserId, findOrderByIdAndUserId, updateOrderByIdAndUserId };
