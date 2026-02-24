import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.ts';
import { ApiResponse } from '../utils/ApiResponse.ts';
import { registerUserService } from '../services/user.service.ts';
import type { RegisterUserBody } from '../validators/user.schema.ts';

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const userData = req.body as RegisterUserBody;
  const createdUser = await registerUserService(userData);

  return res.status(201).json(ApiResponse.created(createdUser, 'User registered successfully'));
});

export { registerUser };
