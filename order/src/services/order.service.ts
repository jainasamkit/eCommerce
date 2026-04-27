import { Types } from 'mongoose';
import { getProductById } from '../clients/product.client.ts';
import { env } from '../config/env.ts';
import { findAddressByIdAndUserId } from '../repository/address.repository.ts';
import {
  createOrder,
  findOrderByIdAndUserId,
  findOrdersByUserId,
  updateOrderByIdAndUserId,
} from '../repository/order.repository.ts';
import { publishOrderCreated } from './order-message.service.ts';
import { OrderStatus, PaymentStatus, type OrderDocument, type OrderModelShape } from '../types/order.types.ts';
import type { PlaceOrderBody } from '../validators/order.schema.ts';
import { ApiError } from '@ecommerce/shared-http';

const toOrderResponse = (order: OrderDocument) => ({
  id: String(order._id),
  userId: String(order.userId),
  productId: String(order.productId),
  addressId: String(order.addressId),
  quantity: order.quantity,
  unitPrice: order.unitPrice,
  subtotal: order.subtotal,
  shippingFee: order.shippingFee,
  tax: order.tax,
  totalAmount: order.totalAmount,
  status: order.status,
  paymentStatus: order.paymentStatus,
  paymentMethod: order.paymentMethod ?? null,
  notes: order.notes ?? null,
  placedAt: order.placedAt,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

const calculateOrderAmounts = (unitPrice: number, quantity: number) => {
  const subtotal = Number((unitPrice * quantity).toFixed(2));
  const shippingFee = Number(env.DEFAULT_SHIPPING_FEE.toFixed(2));
  const tax = Number(((subtotal * env.DEFAULT_TAX_RATE) / 100).toFixed(2));
  const totalAmount = Number((subtotal + shippingFee + tax).toFixed(2));

  return { subtotal, shippingFee, tax, totalAmount };
};

const placeOrder = async (userId: string, payload: PlaceOrderBody) => {
  const address = await findAddressByIdAndUserId(payload.addressId, userId);
  if (!address) {
    throw ApiError.notFound('Address not found');
  }

  const product = await getProductById(payload.productId);
  if (product.quantity < payload.quantity) {
    throw ApiError.badRequest('Insufficient product quantity available');
  }

  const unitPrice = Number(product.price.toFixed(2));
  const amounts = calculateOrderAmounts(unitPrice, payload.quantity);

  const orderPayload: OrderModelShape = {
    userId: new Types.ObjectId(userId),
    productId: new Types.ObjectId(payload.productId),
    addressId: new Types.ObjectId(payload.addressId),
    quantity: payload.quantity,
    unitPrice,
    subtotal: amounts.subtotal,
    shippingFee: amounts.shippingFee,
    tax: amounts.tax,
    totalAmount: amounts.totalAmount,
    status: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    paymentMethod: payload.paymentMethod ?? null,
    notes: payload.notes ?? null,
    placedAt: new Date(),
  };

  const order = await createOrder(orderPayload);
  await publishOrderCreated({
    eventId: crypto.randomUUID(),
    orderId: String(order._id),
    productId: payload.productId,
    quantity: payload.quantity,
  });

  return toOrderResponse(order);
};

const getMyOrders = async (userId: string) => {
  const orders = await findOrdersByUserId(userId);
  return orders.map(toOrderResponse);
};

const getOrderById = async (orderId: string, userId: string) => {
  const order = await findOrderByIdAndUserId(orderId, userId);
  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  return toOrderResponse(order);
};

const cancelOrder = async (orderId: string, userId: string) => {
  const order = await findOrderByIdAndUserId(orderId, userId);
  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  if (
    order.status === OrderStatus.SHIPPED ||
    order.status === OrderStatus.DELIVERED ||
    order.status === OrderStatus.CANCELLED
  ) {
    throw ApiError.badRequest('Order cannot be cancelled');
  }

  const updatedOrder = await updateOrderByIdAndUserId(orderId, userId, {
    status: OrderStatus.CANCELLED,
  });

  if (!updatedOrder) {
    throw ApiError.notFound('Order not found');
  }

  return toOrderResponse(updatedOrder);
};

export { placeOrder, getMyOrders, getOrderById, cancelOrder };
