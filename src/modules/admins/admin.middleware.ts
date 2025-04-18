import { NextFunction } from "express";
import { MRequest, MResponse } from "../../types/express";
import { comparePassword, hashPassword } from "../../utils/bcrypt.utils";
import { ErrorResponseSchema } from "../../interfaces/apiResponse";
import { ErrorCodes } from "../../constants/errorCode.enum";
import { AdminUserType } from "./admin.model";
import AdminUserService from "./admin.service";

class AdminMiddleware {

  private adminUserService: AdminUserService;

  constructor() {
    this.adminUserService = new AdminUserService();
  }

  comparePassword = async (
    req: MRequest,
    res: MResponse,
    next: NextFunction
  ) => {
    const admin = req.foundDoc as AdminUserType;
    const plainTextPassword = req.body.password;
    const isMatch = await comparePassword(plainTextPassword, admin!.password);
    if (!isMatch) {
      return res.status(401).json(
        ErrorResponseSchema.parse({
          message: "Invalid credentials",
          error: {
            code: ErrorCodes.INVALID_CREDENTIALS,
          },
        })
      )
    }

    next();
  }


  isAdmin = async (
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

    if (
      req.method === "PATCH" &&
      /^\/api\/v1\/admins\/[^/]+$/.test(req.originalUrl)
    ) {
      const bodyKeys = Object.keys(req.body);
      if (bodyKeys.length === 1 && bodyKeys[0] === "password") {
        return next();
      }
    }


    const admin = req.user;
    const isAdminValue = admin!.type === "admin";
    if (!isAdminValue) {
      return res.status(401).json(
        ErrorResponseSchema.parse({
          message: "User is not an admin",
          error: {
            code: ErrorCodes.INVALID_CREDENTIALS,
          },
        })
      )
    }

    next();
  }

  createPassword = async (
    req: MRequest,
    res: MResponse,
    next: NextFunction
  ) => {
    if (req.method === "POST") {
      req.body.password = req.body.password ?? "securepassword123"
    }
    const password = req.body.password;
    if (password) {
      const hashedPassword = await hashPassword(password);
      req.body = {
        ...req.body,
        password: hashedPassword,
        initialPasswordReset: true,
      }
    }
    next();
  }

  removeProtectedInfo = async (
    req: MRequest,
    res: MResponse,
    next: NextFunction
  ) => {
    req.query.aggregate = "idAndTypeOnly";
    next();
  }

}

export default AdminMiddleware
