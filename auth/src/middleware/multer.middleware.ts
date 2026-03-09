import fs from 'fs';
import path from 'path';
import multer, { MulterError } from 'multer';
import type { RequestHandler } from 'express';
import { ApiError } from '../utils/ApiError.ts';

interface SingleFileUploadOptions {
  fieldName: string;
  destination?: string;
  maxFileSizeInBytes?: number;
  allowedMimeTypes?: string[];
}

const sanitizeFileName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const createSingleFileUpload = ({
  fieldName,
  destination = 'public/temp',
  maxFileSizeInBytes = 5 * 1024 * 1024,
  allowedMimeTypes = [],
}: SingleFileUploadOptions): RequestHandler => {
  const uploadDir = path.resolve(process.cwd(), destination);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const parsed = path.parse(file.originalname);
      const safeName = sanitizeFileName(parsed.name) || 'file';
      cb(null, `${Date.now()}-${safeName}${parsed.ext.toLowerCase()}`);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: maxFileSizeInBytes },
    fileFilter: (_req, file, cb) => {
      if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(file.mimetype)) {
        cb(new Error('Unsupported file type'));
        return;
      }

      cb(null, true);
    },
  }).single(fieldName);

  return (req, res, next) => {
    upload(req, res, (error) => {
      if (error instanceof MulterError) {
        return next(ApiError.badRequest(error.message));
      }

      if (error instanceof Error) {
        return next(ApiError.badRequest(error.message));
      }

      next();
    });
  };
};

export { createSingleFileUpload };
