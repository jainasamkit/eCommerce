import type { Types } from 'mongoose';

type ProductDocument = {
  _id: Types.ObjectId;
  name: string;
  description: string;
  quantity: number;
  brand?: string;
  price: number;
  images?: string[];
  category?: string[];
  discount?: number;
  specifications?: Record<string, string | number | boolean | string[]>;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type { ProductDocument };
