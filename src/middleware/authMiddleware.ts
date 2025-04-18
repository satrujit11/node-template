import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { MRequest, MResponse } from "../types/express";
import { ErrorCodes } from "../constants/errorCode.enum";
import { CustomError } from "../utils/customError";
import { ErrorResponseSchema } from "../interfaces/apiResponse";
import AdminUserService from "../modules/admins/admin.service";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const JWT_EXPIRES_IN = "1d";




export class AuthMiddlewareService {
  private adminUserService: AdminUserService;

  constructor() {
    this.adminUserService = new AdminUserService();
  }

  async generateAccessToken(userData: { id: string }) {
    return jwt.sign(userData, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  validateAccessToken = async (
    req: MRequest,
    res: MResponse,
    next: NextFunction
  ) => {
    if (req.method === "POST" && req.path === "/admin") {
      const users = await this.adminUserService.index({});
      if (users?.totalDocs === 0) {
        return next();
      }
    }

    const authHeader = req.headers["authorization"];
    let accessToken: string | undefined;

    if (authHeader?.startsWith("Bearer ")) {
      accessToken = authHeader.split(" ")[1];
    }

    if (!accessToken) {
      return next(
        new CustomError("Access token is required", ErrorCodes.INVALID_TOKEN, 401)
      );
    }

    try {
      const decoded = jwt.verify(accessToken, JWT_SECRET) as { id: string };
      const user = await this.adminUserService.show(decoded.id, {});

      if (!user) {
        return res.status(404).json(
          ErrorResponseSchema.parse({
            message: "User not found",
            error: { code: ErrorCodes.USER_NOT_FOUND },
          })
        );
      }

      req.user = user;
      next();
    } catch (error: any) {
      const errorMsg = error.message === "jwt expired"
        ? {
          message: "Token Expired",
          code: ErrorCodes.TOKEN_EXPIRED,
        }
        : {
          message: "Invalid access token",
          code: ErrorCodes.INVALID_TOKEN,
        };

      return res.status(401).json(
        ErrorResponseSchema.parse({
          message: errorMsg.message,
          error: { code: errorMsg.code },
        })
      );
    }
  };
}

