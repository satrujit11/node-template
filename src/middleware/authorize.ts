import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/customError";
import { ErrorCodes } from "../constants/errorCodes";
import { refreshAccessTokenSchema } from "../validations/userValidation";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export const validateRefreshToken = async (req: Request, _res: Response, next: NextFunction) => {
  const { refreshToken } = refreshAccessTokenSchema.parse(req.body);

  if (!refreshToken) {
    return next(new CustomError("Refresh token is required", ErrorCodes.MISSING_TOKEN, 400));
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string; email: string };
    req.userId = decoded.id;
    next();
  } catch (error) {
    return next(new CustomError("Invalid refresh token", ErrorCodes.INVALID_TOKEN, 401));
  }
};
