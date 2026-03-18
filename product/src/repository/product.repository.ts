import { Product } from '../model/product.model.ts';
import type {
  GetProductsQuery,
  ProductDocument,
  ProductLookupFilters,
  ProductListResult,
} from '../types/product.types.ts';

const buildProductFilters = (query: GetProductsQuery): ProductLookupFilters => {
  const filters: ProductLookupFilters = { isDeleted: false };

  if (query.brand) {
    filters.brand = query.brand;
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.search) {
    filters.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
    ];
  }

  return filters;
};

const findProducts = async (query: GetProductsQuery): Promise<ProductListResult> => {
  const filters = buildProductFilters(query);
  const skip = (query.page - 1) * query.limit;

  const [products, total] = await Promise.all([
    Product.find(filters)
      .select('-isDeleted')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    Product.countDocuments(filters),
  ]);

  return { products, total };
};

const findProductById = async (productId: string): Promise<ProductDocument | null> => {
  return Product.findOne({ _id: productId, isDeleted: false }).select('-isDeleted').lean();
};

export { findProducts, findProductById };
