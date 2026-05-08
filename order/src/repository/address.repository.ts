import { Address } from '../model/address.model.ts';
import type { AddressDocument, AddressModelShape } from '../types/address.types.ts';

const createAddress = async (payload: AddressModelShape): Promise<AddressDocument> => {
  return Address.create(payload);
};

const countAddressesByUserId = async (userId: string): Promise<number> => {
  return Address.countDocuments({ userId, isDeleted: false });
};

const findAddressesByUserId = async (userId: string): Promise<AddressDocument[]> => {
  return Address.find({ userId, isDeleted: false }).sort({ isDefault: -1, createdAt: -1 });
};

const findAddressByIdAndUserId = async (
  addressId: string,
  userId: string,
): Promise<AddressDocument | null> => {
  return Address.findOne({ _id: addressId, userId, isDeleted: false });
};

const updateAddressByIdAndUserId = async (
  addressId: string,
  userId: string,
  payload: Partial<AddressModelShape>,
): Promise<AddressDocument | null> => {
  return Address.findOneAndUpdate({ _id: addressId, userId, isDeleted: false }, payload, {
    returnDocument: 'after',
  });
};

const unsetDefaultAddressesForUser = async (userId: string): Promise<void> => {
  await Address.updateMany({ userId, isDeleted: false, isDefault: true }, { isDefault: false });
};

const softDeleteAddressByIdAndUserId = async (
  addressId: string,
  userId: string,
): Promise<AddressDocument | null> => {
  return Address.findOneAndUpdate(
    { _id: addressId, userId, isDeleted: false },
    { isDeleted: true, isDefault: false },
    { returnDocument: 'after' },
  );
};

const findFirstAddressByUserId = async (userId: string): Promise<AddressDocument | null> => {
  return Address.findOne({ userId, isDeleted: false }).sort({ createdAt: 1 });
};

export {
  createAddress,
  countAddressesByUserId,
  findAddressesByUserId,
  findAddressByIdAndUserId,
  updateAddressByIdAndUserId,
  unsetDefaultAddressesForUser,
  softDeleteAddressByIdAndUserId,
  findFirstAddressByUserId,
};
