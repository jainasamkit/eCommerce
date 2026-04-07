import type { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse.ts';
import * as productService from '../services/product.service.ts';
import type {
  GetProductsQuery,
  GetProductsResponse,
  ProductDetailResponse,
} from '../types/product.types.ts';
import {
  productIdParamSchema,
  productQuerySchema,
  type ProductParams,
} from '../validators/product.schema.ts';

const getProducts = async (req: Request, res: Response) => {
  const query: GetProductsQuery = productQuerySchema.parse(req.query);
  const products: GetProductsResponse = await productService.getProducts(query);

  return res.status(200).json(ApiResponse.success(products, 'Products fetched successfully'));
};

const getProductById = async (req: Request, res: Response) => {
  const params: ProductParams = productIdParamSchema.parse(req.params);
  const product: ProductDetailResponse = await productService.getProductById(params.productId);

  return res.status(200).json(ApiResponse.success(product, 'Product fetched successfully'));
};

export { getProducts, getProductById };
