import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  RABBITMQ_URL: z.string().min(1, 'RABBITMQ_URL is required'),
  RABBITMQ_EXCHANGE: z.string().min(1, 'RABBITMQ_EXCHANGE is required'),
  RABBITMQ_INVENTORY_QUEUE: z.string().min(1, 'RABBITMQ_INVENTORY_QUEUE is required'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables');
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
