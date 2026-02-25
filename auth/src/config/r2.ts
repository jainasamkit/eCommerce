import { S3Client } from '@aws-sdk/client-s3';
import { env } from './env.ts';
import { ApiError } from '../utils/ApiError.ts';

let r2Client: S3Client | null = null;

const getR2Client = () => {
  if (r2Client) {
    return r2Client;
  }

  if (!env.R2_ACCESS_KEY || !env.R2_SECRET_KEY) {
    throw ApiError.internal('R2 credentials are not configured');
  }

  if (!env.R2_ENDPOINT) {
    throw ApiError.internal('R2 endpoint is not configured');
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
