import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3003),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  PRODUCT_SERVICE_URL: z.string().min(1, 'PRODUCT_SERVICE_URL is required'),
  ACCESS_TOKEN_SECRET: z.string().min(1, 'ACCESS_TOKEN_SECRET is required'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables');
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
