import { Request, Response, NextFunction } from "express";
import { Model, Types } from "mongoose";
import { assertExists, assertUnique } from "../utils/assertConditions";
import { ErrorResponseSchema } from "../interfaces/apiResponse";
import { MRequest } from "../types/express";

export function checkUnique<T>(
  model: Model<T>,
  field: keyof T,
  location: "body" | "query" | "params" = "body",
  customMessage = "Duplicate entry"
) {
  return async (req: MRequest, res: Response, next: NextFunction) => {
    const value = req[location]?.[field as string];
    if (!value) return next(); // skip if value isn't present
    const response = await assertUnique(model, field, value, customMessage);

    if (response) {
      return res.status(409).json(response);
    }

    next();
  };
}

export function checkExists<T>(
  model: Model<T>,
  modelKey: keyof T | string, // actual DB field to query
  location: "params" | "query" | "body" = "params",
  customMessage = "Resource not found",
  requestKey?: string // optional: where to pull value from (defaults to modelKey)
) {
  return async (req: MRequest, res: Response, next: NextFunction) => {
    const key = requestKey || modelKey;
    const value = req[location]?.[key as string];

    if (!value) return next(); // skip if value not present

    const response = await assertExists(model, modelKey as keyof T, value, customMessage);

    const parsedError = ErrorResponseSchema.safeParse(response);
    if (parsedError.success) {
      return res.status(404).json(parsedError.data);
    }

    (req as any).foundDoc = response;

    next();
  };
}

