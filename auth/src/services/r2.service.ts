import fs from 'fs';
import { unlink } from 'fs/promises';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getR2Client } from '../config/r2.ts';
import { env } from '../config/env.ts';
import { ApiError } from '../utils/ApiError.ts';
import type { UploadFileResponse } from '../types/storage.types.ts';

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '');

const buildPublicUrl = (key: string) => {
  if (env.R2_PUBLIC_URL) {
    return `${normalizeBaseUrl(env.R2_PUBLIC_URL)}/${key}`;
  }

  return key;
};

const uploadFileToR2 = async (
  file: Express.Multer.File,
  folder = 'uploads',
): Promise<UploadFileResponse> => {
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

    const uploadResponse: UploadFileResponse = {
      key,
      url: buildPublicUrl(key),
    };

    return uploadResponse;
  } catch {
    throw ApiError.internal('Error uploading profile picture');
  } finally {
    await unlink(file.path).catch(() => undefined);
  }
};

export { uploadFileToR2 };
