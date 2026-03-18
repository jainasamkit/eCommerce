import { isValidObjectId } from 'mongoose';
import { ApiError } from '../utils/ApiError.ts';
import { findProductById, findProducts } from '../repository/product.repository.ts';
import type {
  GetProductsQuery,
  GetProductsResponse,
  ProductDetailResponse,
  ProductDocument,
  ProductListResult,
  ProductListItem,
} from '../types/product.types.ts';

const toProductResponse = (product: ProductDocument): ProductListItem => ({
  id: String(product._id),
  name: product.name,
  description: product.description,
  quantity: product.quantity,
  brand: product.brand ?? null,
  price: product.price,
  images: product.images ?? [],
  category: product.category ?? [],
  discount: product.discount ?? null,
  createdBy: product.createdBy ? String(product.createdBy) : null,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const getProducts = async (query: GetProductsQuery): Promise<GetProductsResponse> => {
  const result: ProductListResult = await findProducts(query);

  return {
    products: result.products.map(toProductResponse),
    pagination: {
      page: query.page,
      limit: query.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / query.limit),
    },
  };
};

const getProductById = async (productId: string): Promise<ProductDetailResponse> => {
  if (!isValidObjectId(productId)) {
    throw ApiError.badRequest('Invalid product id');
  }

  const product: ProductDocument | null = await findProductById(productId);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  return toProductResponse(product);
};

export { getProducts, getProductById };
