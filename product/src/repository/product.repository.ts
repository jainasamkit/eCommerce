import { Product } from '../model/product.model.ts';
import type {
  GetProductsQuery,
  ProductDocument,
  ProductLookupFilters,
  ProductListResult,
  ProductSortField,
  ProductSortOrder,
} from '../types/product.types.ts';

const SORT_FIELD_MAP: Record<ProductSortField, 'createdAt' | 'price' | 'name'> = {
  createdAt: 'createdAt',
  price: 'price',
  name: 'name',
};

const SORT_ORDER_MAP: Record<ProductSortOrder, 1 | -1> = {
  asc: 1,
  desc: -1,
};

const buildProductFilters = (query: GetProductsQuery): ProductLookupFilters => {
  const filters: ProductLookupFilters = { isDeleted: false };

  if (query.brand?.length) {
    const brandFilters = query.brand;
    filters.brand = brandFilters.length === 1 ? brandFilters[0]! : { $in: brandFilters };
  }

  if (query.category?.length) {
    const categoryFilters = query.category;
    filters.category =
      categoryFilters.length === 1 ? categoryFilters[0]! : { $in: categoryFilters };
  }

  if (query.search) {
    filters.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
      { brand: { $regex: query.search, $options: 'i' } },
      { category: { $regex: query.search, $options: 'i' } },
    ];
  }

  if (query.specifications) {
    for (const [specificationKey, specificationValue] of Object.entries(query.specifications)) {
      filters[`specifications.${specificationKey}`] = specificationValue;
    }
  }

  if (query.specificationKey && query.specificationValue) {
    filters[`specifications.${query.specificationKey}`] = query.specificationValue;
  }

  return filters;
};

const buildProductSort = (query: GetProductsQuery) => ({
  [SORT_FIELD_MAP[query.sortBy]]: SORT_ORDER_MAP[query.sortOrder],
});

const findProducts = async (query: GetProductsQuery): Promise<ProductListResult> => {
  const filters = buildProductFilters(query);
  const sort = buildProductSort(query);
  const skip = (query.page - 1) * query.limit;

  const [products, total] = await Promise.all([
    Product.find(filters)
      .select('-isDeleted')
      .sort(sort)
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
