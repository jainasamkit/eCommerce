import { ApiError } from '@ecommerce/shared-http';
import { env } from '../config/env.ts';

type ProductDetail = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  brand: string | null;
  price: number;
  images: string[];
  category: string[];
  discount: number | null;
  specifications: Record<string, string | number | boolean | string[]>;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

type ProductDetailResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: ProductDetail | null;
};

const getProductById = async (productId: string): Promise<ProductDetail> => {
  const response = await fetch(`${env.PRODUCT_SERVICE_URL}/api/v1/products/${productId}`);

  if (response.status === 404) {
    throw ApiError.notFound('Product not found');
  }

  if (!response.ok) {
    throw ApiError.internal('Unable to fetch product details');
  }

  const body = (await response.json()) as ProductDetailResponse;
  if (!body.data) {
    throw ApiError.notFound('Product not found');
  }

  return body.data;
};

export { getProductById };
