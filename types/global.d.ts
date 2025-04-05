import type { SuccessResponse as _SuccessResponse, ErrorResponse as _ErrorResponse } from "../src/types/apiResponse";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      foundDoc?: unknown; // or your model type
    }
  }

  type SuccessResponse = _SuccessResponse;
  type ErrorResponse = _ErrorResponse;
}

