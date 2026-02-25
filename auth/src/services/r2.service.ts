import fs from 'fs';
import { unlink } from 'fs/promises';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getR2Client } from '../config/r2.ts';
import { env } from '../config/env.ts';
import { ApiError } from '../utils/ApiError.ts';

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '');

const buildPublicUrl = (key: string) => {
  if (env.R2_PUBLIC_URL) {
    return `${normalizeBaseUrl(env.R2_PUBLIC_URL)}/${key}`;
  }

  return key;
};

const uploadFileToR2 = async (file: Express.Multer.File, folder = 'uploads') => {
  if (!env.R2_BUCKET) {
    throw ApiError.internal('R2 bucket name is not configured');
  }

  const sanitizedFolder = folder.replace(/^\/+|\/+$/g, '');
  const key = `${sanitizedFolder}/${file.filename}`;

  try {
    await getR2Client().send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET,
        Key: key,
        Body: fs.createReadStream(file.path),
        ContentType: file.mimetype,
      }),
    );

    return {
      key,
      url: buildPublicUrl(key),
    };
  } finally {
    await unlink(file.path).catch(() => undefined);
  }
};

export { uploadFileToR2 };
