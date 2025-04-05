import { Model, FilterQuery, Types } from "mongoose";
import { ErrorResponse, ErrorResponseSchema } from "../interfaces/apiResponse";
import { ErrorCodes } from "../constants/errorCode.enum";

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

export async function assertExists<T>(
  model: Model<T>,
  field: keyof T,
  value: any,
  message = "Resource not found"
): Promise<ErrorResponse | T> {

  if (field === "_id" && !Types.ObjectId.isValid(value as string)) {
    return ErrorResponseSchema.parse({
      message,
      error: {
        code: ErrorCodes.INVALID_ID,
        details: value,
      },
    })
  }

  const filter: FilterQuery<T> = { [field]: value } as FilterQuery<T>;
  const doc = await model.findOne(filter);
  console.log("Doc", doc);

  if (doc === null) {
    return ErrorResponseSchema.parse({
      message,
      error: {
        code: ErrorCodes.NOT_FOUND,
        details: filter,
      },
    })
  }

  return doc;
}
