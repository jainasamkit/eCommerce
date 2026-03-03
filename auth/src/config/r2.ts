import { S3Client } from '@aws-sdk/client-s3';
import { env } from './env.ts';
import { ApiError } from '../utils/ApiError.ts';

let r2Client: S3Client | null = null;

const getR2Client = () => {
  if (r2Client) {
    return r2Client;
  }

  if (!env.R2_ACCESS_KEY || !env.R2_SECRET_KEY) {
    console.error('Storage configuration error: R2_ACCESS_KEY or R2_SECRET_KEY is not configured');
    throw ApiError.internal('Storage configuration error');
  }

  if (!env.R2_ENDPOINT) {
    console.error('Storage configuration error: R2_ENDPOINT is not configured');
    throw ApiError.internal('Storage configuration error');
  }

  r2Client = new S3Client({
    region: 'auto',
    endpoint: env.R2_ENDPOINT,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY,
      secretAccessKey: env.R2_SECRET_KEY,
    },
  });

  return r2Client;
};

export { getR2Client };
