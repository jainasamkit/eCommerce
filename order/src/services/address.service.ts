import { Types } from 'mongoose';
import {
  countAddressesByUserId,
  createAddress,
  findAddressByIdAndUserId,
  findAddressesByUserId,
  findFirstAddressByUserId,
  softDeleteAddressByIdAndUserId,
  unsetDefaultAddressesForUser,
  updateAddressByIdAndUserId,
} from '../repository/address.repository.ts';
import type { AddressDocument, AddressModelShape } from '../types/address.types.ts';
import type {
  CreateAddressBody,
  UpdateAddressBody,
} from '../validators/address.schema.ts';
import { ApiError } from '@ecommerce/shared-http';

const toAddressResponse = (address: AddressDocument) => ({
  id: String(address._id),
  userId: String(address.userId),
  fullName: address.fullName,
  phoneNumber: address.phoneNumber,
  addressLine1: address.addressLine1,
  addressLine2: address.addressLine2 ?? null,
  city: address.city,
  state: address.state,
  postalCode: address.postalCode,
  country: address.country,
  landmark: address.landmark ?? null,
  addressType: address.addressType ?? null,
  isDefault: address.isDefault,
  isDeleted: address.isDeleted,
  createdAt: address.createdAt,
  updatedAt: address.updatedAt,
});

const getAddresses = async (userId: string) => {
  const addresses = await findAddressesByUserId(userId);
  return addresses.map(toAddressResponse);
};

const getAddressById = async (addressId: string, userId: string) => {
  const address = await findAddressByIdAndUserId(addressId, userId);
  if (!address) {
    throw ApiError.notFound('Address not found');
  }

  return toAddressResponse(address);
};

const createUserAddress = async (userId: string, payload: CreateAddressBody) => {
  const totalAddresses = await countAddressesByUserId(userId);
  const shouldBeDefault = payload.isDefault ?? (totalAddresses === 0);

  if (shouldBeDefault) {
    await unsetDefaultAddressesForUser(userId);
  }

  const addressPayload: AddressModelShape = {
    userId: new Types.ObjectId(userId),
    fullName: payload.fullName,
    phoneNumber: payload.phoneNumber,
    addressLine1: payload.addressLine1,
    addressLine2: payload.addressLine2 ?? null,
    city: payload.city,
    state: payload.state,
    postalCode: payload.postalCode,
    country: payload.country,
    landmark: payload.landmark ?? null,
    addressType: payload.addressType ?? null,
    isDefault: shouldBeDefault,
    isDeleted: false,
  };

  const address = await createAddress(addressPayload);
  return toAddressResponse(address);
};

const updateAddress = async (addressId: string, userId: string, payload: UpdateAddressBody) => {
  const existingAddress = await findAddressByIdAndUserId(addressId, userId);
  if (!existingAddress) {
    throw ApiError.notFound('Address not found');
  }

  if (payload.isDefault === true) {
    await unsetDefaultAddressesForUser(userId);
  }

  const updatePayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  ) as Partial<AddressModelShape>;

  const updatedAddress = await updateAddressByIdAndUserId(addressId, userId, updatePayload);
  if (!updatedAddress) {
    throw ApiError.notFound('Address not found');
  }

  return toAddressResponse(updatedAddress);
};

const setDefaultAddress = async (addressId: string, userId: string) => {
  const existingAddress = await findAddressByIdAndUserId(addressId, userId);
  if (!existingAddress) {
    throw ApiError.notFound('Address not found');
  }

  await unsetDefaultAddressesForUser(userId);

  const updatedAddress = await updateAddressByIdAndUserId(addressId, userId, { isDefault: true });
  if (!updatedAddress) {
    throw ApiError.notFound('Address not found');
  }

  return toAddressResponse(updatedAddress);
};

const deleteAddress = async (addressId: string, userId: string) => {
  const deletedAddress = await softDeleteAddressByIdAndUserId(addressId, userId);
  if (!deletedAddress) {
    throw ApiError.notFound('Address not found');
  }

  if (deletedAddress.isDefault) {
    const fallbackAddress = await findFirstAddressByUserId(userId);
    if (fallbackAddress) {
      await unsetDefaultAddressesForUser(userId);
      await updateAddressByIdAndUserId(String(fallbackAddress._id), userId, { isDefault: true });
    }
  }

  return {
    deleted: true,
    id: String(deletedAddress._id),
  };
};

export { getAddresses, getAddressById, createUserAddress, updateAddress, setDefaultAddress, deleteAddress };
