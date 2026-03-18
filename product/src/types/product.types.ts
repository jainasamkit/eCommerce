import type { Types } from 'mongoose';
import type { z } from 'zod';
import type { productQuerySchema } from '../validators/product.schema.ts';

type ProductModelShape = {
  name: string;
  description: string;
  quantity: number;
  brand?: string;
  price: number;
  images?: string[];
  category?: string[];
  discount?: number;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
};

type ProductDocument = ProductModelShape & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

type ProductListItem = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  brand: string | null;
  price: number;
  images: string[];
  category: string[];
  discount: number | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ProductDetailResponse = ProductListItem;

type GetProductsQuery = z.infer<typeof productQuerySchema>;

type GetProductsResponse = {
  products: ProductListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type ProductLookupFilters = {
  isDeleted: boolean;
  brand?: string;
  category?: string;
  $or?: Array<Record<string, unknown>>;
};

type ProductListResult = {
  products: ProductDocument[];
  total: number;
};

export type {
  ProductModelShape,
  ProductDocument,
  ProductListItem,
  ProductDetailResponse,
  GetProductsQuery,
  GetProductsResponse,
  ProductLookupFilters,
  ProductListResult,
};
