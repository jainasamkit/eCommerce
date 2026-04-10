import type { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse.ts';
import * as addressService from '../services/address.service.ts';
import type { CreateAddressBody, UpdateAddressBody } from '../validators/address.schema.ts';

const createAddress = async (req: Request, res: Response) => {
  const payload: CreateAddressBody = req.body;
  const address = await addressService.createUserAddress(req.user!.id, payload);

  return res.status(201).json(ApiResponse.created(address, 'Address created successfully'));
};

const getAddresses = async (req: Request, res: Response) => {
  const addresses = await addressService.getAddresses(req.user!.id);
  return res.status(200).json(ApiResponse.success(addresses, 'Addresses fetched successfully'));
};

const getAddressById = async (req: Request, res: Response) => {
  const { addressId } = req.params as { addressId: string };
  const address = await addressService.getAddressById(addressId, req.user!.id);
  return res.status(200).json(ApiResponse.success(address, 'Address fetched successfully'));
};

const updateAddress = async (req: Request, res: Response) => {
  const payload: UpdateAddressBody = req.body;
  const { addressId } = req.params as { addressId: string };
  const address = await addressService.updateAddress(addressId, req.user!.id, payload);

  return res.status(200).json(ApiResponse.success(address, 'Address updated successfully'));
};

const setDefaultAddress = async (req: Request, res: Response) => {
  const { addressId } = req.params as { addressId: string };
  const address = await addressService.setDefaultAddress(addressId, req.user!.id);
  return res.status(200).json(ApiResponse.success(address, 'Default address updated successfully'));
};

const deleteAddress = async (req: Request, res: Response) => {
  const { addressId } = req.params as { addressId: string };
  const result = await addressService.deleteAddress(addressId, req.user!.id);
  return res.status(200).json(ApiResponse.success(result, 'Address deleted successfully'));
};

export { createAddress, getAddresses, getAddressById, updateAddress, setDefaultAddress, deleteAddress };
