import { Model, FilterQuery } from "mongoose";
import { ErrorResponse, ErrorResponseSchema } from "../types/apiResponse";
import { ErrorCodes } from "../constants/errorCodes";

export async function assertUnique<T>(
  model: Model<T>,
  field: keyof T,
  value: T[keyof T],
  message = "Duplicate entry"
): Promise<ErrorResponse | null> {
  const filter: FilterQuery<T> = { [field]: value } as FilterQuery<T>;
  const exists = await model.findOne(filter);

  if (exists) {
    return ErrorResponseSchema.parse({
      message,
      error: {
        code: ErrorCodes.DUPLICATE_ENTRY,
        details: { [field]: value },
      },
    })
  }

  return null;
}
