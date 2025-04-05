import { Request, Response, NextFunction } from "express";
import { Model } from "mongoose";
import { assertUnique } from "../utils/assertUniqueness";

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

