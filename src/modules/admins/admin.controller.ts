import { SuccessResponseSchema } from "../../interfaces/apiResponse";
import { buildPaginationOptions } from "../../utils/buildPaginationOptions";
import catchAsync from "../../utils/catchAsync";
import { adminUserPartialSchema, adminUserSchema } from "./admin.interface";
import AdminUserService from "./admin.service";
import { MRequest, MResponse } from "../../types/express";
import { adminAggregates, adminQueries } from "./admin.query";
import { AuthMiddlewareService } from "../../middleware/authMiddleware";
import { AdminUserType } from "./admin.model";


class AdminUserController {
  adminService = new AdminUserService();
  authMiddlewareService = new AuthMiddlewareService();

  index = catchAsync(async (req: MRequest, res: MResponse) => {
    const options = buildPaginationOptions(req, {
      allowedQueryFields: adminQueries,
      predefinedAggregates: adminAggregates,
    });

    const admins = await this.adminService.index(options);
    const response = SuccessResponseSchema.parse({
      message: "AdminUsers fetched successfully",
      data: admins,
    });
    res.status(200).json(response);
  })

  show = catchAsync(async (req: MRequest, res: MResponse) => {
    const user = req.foundDoc as AdminUserType;
    const adminId = user._id;
    const options = buildPaginationOptions(req, {
      allowedQueryFields: adminQueries,
      predefinedAggregates: adminAggregates,
      mode: "single",
    });
    const admin = await this.adminService.show(adminId, options);
    const response = SuccessResponseSchema.parse({
      message: "AdminUser fetched successfully",
      data: admin,
    });
    res.status(200).json(response);
  })

  create = catchAsync(async (req: MRequest, res: MResponse) => {
    const parsedPayload = adminUserSchema.parse(req.body);
    const admin = await this.adminService.create(parsedPayload);
    const response = SuccessResponseSchema.parse({
      message: "AdminUser created successfully",
      data: admin,
    });
    res.status(201).json(response);
  })

  update = catchAsync(async (req: MRequest, res: MResponse) => {
    const user = req.foundDoc as AdminUserType;
    const adminId = user._id;
    const parsedPayload = adminUserPartialSchema.parse(req.body);
    const admin = await this.adminService.update(adminId, parsedPayload);
    const response = SuccessResponseSchema.parse({
      message: "AdminUser updated successfully",
      data: admin,
    });
    res.status(200).json(response);
  })

  delete = catchAsync(async (req: MRequest, res: MResponse) => {
    const user = req.foundDoc as AdminUserType;
    const adminId = user._id;
    const admin = await this.adminService.delete(adminId);
    const response = SuccessResponseSchema.parse({
      message: "AdminUser deleted successfully",
      data: admin,
    });
    res.status(200).json(response);
  })

  login = catchAsync(async (req: MRequest, res: MResponse) => {
    const user = req.foundDoc as AdminUserType;
    const adminId = user._id;
    const token = await this.authMiddlewareService.generateAccessToken({ id: adminId });
    const response = SuccessResponseSchema.parse({
      message: "AdminUser logged in successfully",
      data: {
        ...user.toJSON(),
        token,
      },
    });
    res.status(200).json(response);
  })
}

export default AdminUserController;

