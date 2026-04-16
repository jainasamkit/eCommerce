import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3002),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  RABBITMQ_URL: z.string().min(1, 'RABBITMQ_URL is required'),
  ACCESS_TOKEN_SECRET: z.string().min(1, 'ACCESS_TOKEN_SECRET is required'),
  DEFAULT_SHIPPING_FEE: z.coerce.number().nonnegative().default(0),
  DEFAULT_TAX_RATE: z.coerce.number().nonnegative().default(0),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables');
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
