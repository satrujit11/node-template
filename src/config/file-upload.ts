import multer, { MulterError } from 'multer';
import path from 'path';
import { NextFunction } from 'express';
import { Multer } from 'multer';
import { MRequest, MResponse } from '../types/express';
import { ErrorResponseSchema } from '../interfaces/apiResponse';
import { ErrorCodes } from '../constants/errorCode.enum';
import fs from 'fs';

// Create the directory if it doesn't exist
function ensureDirectoryExistence(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

class FileUploadHandler {
  private upload: Multer;

  constructor(uploadDirectory: string) {
    const storage = multer.diskStorage({
      destination: (_req, _file, cb) => {
        // Get absolute path to the uploads folder
        const uploadPath = path.join(__dirname, '..', uploadDirectory); // '..' goes one level up

        // Ensure the upload directory exists
        ensureDirectoryExistence(uploadPath);

        cb(null, uploadPath);
      },
      filename: (_req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
      },
    });

    this.upload = multer({ storage });
  }

  public handleFileUploads() {
    return (req: MRequest, res: MResponse, next: NextFunction) => {
      console.log(req.body);
      const contentType = req.headers['content-type'] || '';
      const isMultipart = contentType.startsWith('multipart/form-data');

      if (!isMultipart) return next(); // Skip if not multipart/form-data

      this.upload.any()(req, res, (err) => {
        console.log(req.files);
        if (err) {
          console.error("Multer file upload error:", err);

          const message =
            err instanceof MulterError ? err.message : 'Unknown error occurred during file upload.';

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
          req.files.forEach(file => {
            const field = file.fieldname;
            console.log(`Handling field: ${field}`);

            // Parse the fieldname to extract the relevant parts (e.g., [1] and [aadharFile])
            const parts = field.split(/[\[\]]+/).filter(Boolean);

            if (parts.length >= 3) {
              const arrayKey = parts[0]; // 'emergencyContacts'
              const index = parseInt(parts[1], 10); // '1'
              const key = parts[2]; // 'aadharFile'

              // Ensure emergencyContacts is an array and the index exists
              if (Array.isArray(req.body[arrayKey]) && req.body[arrayKey][index]) {
                // Add the file path to the correct place in the nested structure
                req.body[arrayKey][index][key] = `/uploads/${file.filename}`;
              }
            } else {
              // If it's not a nested field, handle it normally
              if (!req.body[field]) {
                req.body[field] = `/uploads/${file.filename}`;
              } else if (typeof req.body[field] === 'string') {
                req.body[field] = [req.body[field], `/uploads/${file.filename}`];
              } else if (Array.isArray(req.body[field])) {
                req.body[field].push(`/uploads/${file.filename}`);
              }
            }

            console.log('Updated req.body:', req.body);
          });
        }

        next();
      });
    };

  }
}

export default FileUploadHandler;

