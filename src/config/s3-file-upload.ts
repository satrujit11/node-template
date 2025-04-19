import multer, { MulterError } from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import path from 'path';
import { NextFunction } from 'express';
import { MRequest, MResponse } from '../types/express';
import { ErrorResponseSchema } from '../interfaces/apiResponse';
import { ErrorCodes } from '../constants/errorCode.enum';

// Configure the MinIO-compatible S3 client
const s3 = new S3Client({
  endpoint: 'http://localhost:9000', // Change to your MinIO URL
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'MINIO_ACCESS_KEY',
    secretAccessKey: 'MINIO_SECRET_KEY',
  },
  forcePathStyle: true, // Required for MinIO
});

class S3FileUploadHandler {
  private upload: multer.Multer;

  constructor(private bucketName: string) {
    const storage = multerS3({
      s3: s3,
      bucket: bucketName,
      acl: 'public-read', // Or 'private' depending on your use case
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (_req, file, cb) => {
        const filename = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, filename);
      },
    });

    this.upload = multer({ storage });
  }

  public handleFileUploads() {
    return (req: MRequest, res: MResponse, next: NextFunction) => {
      const contentType = req.headers['content-type'] || '';
      const isMultipart = contentType.startsWith('multipart/form-data');

      if (!isMultipart) return next();

      this.upload.any()(req, res, (err) => {
        if (err) {
          console.error('Multer S3 file upload error:', err);
          const message =
            err instanceof MulterError ? err.message : 'Unknown error occurred during S3 upload.';
          return res.status(401).json(
            ErrorResponseSchema.parse({
              message,
              error: {
                code: ErrorCodes.FILE_UPLOAD_ERROR,
              },
            })
          );
        }

        if (req.files && Array.isArray(req.files)) {
          req.files.forEach((file: any) => {
            const field = file.fieldname;
            const fileUrl = file.location; // public URL of the file in MinIO
            const parts = field.split(/[\[\]]+/).filter(Boolean);

            if (parts.length >= 3) {
              const arrayKey = parts[0];
              const index = parseInt(parts[1], 10);
              const key = parts[2];

              if (Array.isArray(req.body[arrayKey]) && req.body[arrayKey][index]) {
                req.body[arrayKey][index][key] = fileUrl;
              }
            } else {
              if (!req.body[field]) {
                req.body[field] = fileUrl;
              } else if (typeof req.body[field] === 'string') {
                req.body[field] = [req.body[field], fileUrl];
              } else if (Array.isArray(req.body[field])) {
                req.body[field].push(fileUrl);
              }
            }
          });
        }

        next();
      });
    };
  }
}

export default S3FileUploadHandler;

