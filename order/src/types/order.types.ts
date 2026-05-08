import type { Types } from 'mongoose';

enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

type OrderModelShape = {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  addressId: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  status: `${OrderStatus}`;
  paymentStatus: `${PaymentStatus}`;
  paymentMethod?: string | null;
  notes?: string | null;
  placedAt: Date;
};

type OrderDocument = OrderModelShape & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export { OrderStatus, PaymentStatus };
export type { OrderModelShape, OrderDocument };
