import { Product } from '../model/product.model.ts';
import type { ProductDocument } from '../types/product.types.ts';

const findProductById = async (productId: string): Promise<ProductDocument | null> => {
  return Product.findOne({ _id: productId, isDeleted: false });
};

const decrementProductQuantity = async (
  productId: string,
  quantity: number,
): Promise<ProductDocument | null> => {
  return Product.findOneAndUpdate(
    { _id: productId, isDeleted: false, quantity: { $gte: quantity } },
    { $inc: { quantity: -quantity } },
    { returnDocument: 'after' },
  );
};

export { findProductById, decrementProductQuantity };
