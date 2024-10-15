import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ErrorResponseSchema } from "../types/apiResponse";
import { ErrorCodes } from "../constants/errorCodes";
import { CustomError } from "../utils/customError";

export const handleErrorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {

  // Zod Validation error
  if (err instanceof z.ZodError) {
    const response = ErrorResponseSchema.parse({
      message: "Validation failed",
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        details: err.issues,
      },
    });
    return res.status(400).json(response);
  }

  // Handle other known errors with specific codes
  if (err instanceof CustomError) {
    const response = ErrorResponseSchema.parse({
      message: err.message,
      error: {
        code: err.code,
      },
    });
    return res.status(err.statusCode).json(response);
  }

  // Check if the error has a specific structure (e.g., MongoDB errors)
  if (err instanceof Error && err.message.includes("MongoError")) {
    const response = ErrorResponseSchema.parse({
      message: "Database error",
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        details: err.message,
      },
    });
    return res.status(500).json(response);
  }

  console.log(err);

  // Other errors
  const response = ErrorResponseSchema.parse({
    message: "Internal server error",
    error: {
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      details: "An unexpected error occurred.",
    },
  });
  return res.status(500).json(response);
};

