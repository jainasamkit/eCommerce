import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000').transform(Number),
  MONGO_URI: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRY: z.string().default('1d'),
  REFRESH_TOKEN_EXPIRY: z.string().default('7d'),
  R2_ACCESS_KEY: z.string(),
  R2_SECRET_KEY: z.string(),
  R2_BUCKET: z.string(),
  R2_PUBLIC_URL: z.string(),
  R2_ENDPOINT: z.string(),
  RESEND_KEY: z.string(),
  RESEND_FROM_EMAIL: z.string().email().default('onboarding@resend.dev'),
  RESET_PASSWORD_URL_BASE: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables');
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
