import { Request, Response, NextFunction } from "express";
import { Model, Types } from "mongoose";
import { assertExists, assertUnique } from "../utils/assertConditions";
import { ErrorResponseSchema } from "../interfaces/apiResponse";

export function checkUnique<T>(
  model: Model<T>,
  field: keyof T,
  location: "body" | "query" | "params" = "body",
  customMessage = "Duplicate entry"
) {
  return async (req: Request, res: Response, next: NextFunction) => {
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
  field: keyof T, // default param key
  location: "params" | "query" = "params",
  customMessage = "Resource not found"
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const value = req[location]?.[field as string];
    if (!value) return next(); // skip if value isn't preset
    const response = await assertExists(model, field, value, customMessage);

    const parsedError = ErrorResponseSchema.safeParse(response);
    if (parsedError.success) {
      return res.status(404).json(parsedError.data);
    }

    (req as any).foundDoc = response;

    next();
  };
}
