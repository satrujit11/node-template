import { SuccessResponseSchema } from "../../interfaces/apiResponse";
import { buildPaginationOptions } from "../../utils/buildPaginationOptions";
import catchAsync from "../../utils/catchAsync";
import { MRequest, MResponse } from "../../types/express";
import { AuthMiddlewareService } from "../../middleware/authMiddleware";
import WarehouseService from "./warehouses.service";
import { WarehouseType } from "./warehouses.model";
import { warehousePartialSchema, warehouseSchema } from "./warehouses.interface";
import { warehouseAggregates, warehouseQueries } from "./warehouses.query";


class WarehouseController {
  warehouseService = new WarehouseService();
  authMiddlewareService = new AuthMiddlewareService();

  index = catchAsync(async (req: MRequest, res: MResponse) => {
    const options = buildPaginationOptions(req, {
      allowedQueryFields: warehouseQueries,
      predefinedAggregates: warehouseAggregates,
    });

    const warehouses = await this.warehouseService.index(options);
    const response = SuccessResponseSchema.parse({
      message: "Warehouses fetched successfully",
      data: warehouses,
    });
    res.status(200).json(response);
  })

  show = catchAsync(async (req: MRequest, res: MResponse) => {
    const user = req.foundDoc as WarehouseType;
    const warehouseId = user._id;
    const options = buildPaginationOptions(req, {
      allowedQueryFields: warehouseQueries,
      predefinedAggregates: warehouseAggregates,
      mode: "single",
    });
    const warehouse = await this.warehouseService.show(warehouseId, options);
    const response = SuccessResponseSchema.parse({
      message: "Warehouse fetched successfully",
      data: warehouse,
    });
    res.status(200).json(response);
  })

  create = catchAsync(async (req: MRequest, res: MResponse) => {
    const parsedPayload = warehouseSchema.parse(req.body);
    const warehouse = await this.warehouseService.create(parsedPayload);
    const response = SuccessResponseSchema.parse({
      message: "Warehouse created successfully",
      data: warehouse,
    });
    res.status(201).json(response);
  })

  update = catchAsync(async (req: MRequest, res: MResponse) => {
    const user = req.foundDoc as WarehouseType;
    const warehouseId = user._id;
    const parsedPayload = warehousePartialSchema.parse(req.body);
    const warehouse = await this.warehouseService.update(warehouseId, parsedPayload);
    const response = SuccessResponseSchema.parse({
      message: "Warehouse updated successfully",
      data: warehouse,
    });
    res.status(200).json(response);
  })

  delete = catchAsync(async (req: MRequest, res: MResponse) => {
    const user = req.foundDoc as WarehouseType;
    const warehouseId = user._id;
    const warehouse = await this.warehouseService.delete(warehouseId);
    const response = SuccessResponseSchema.parse({
      message: "Warehouse deleted successfully",
      data: warehouse,
    });
    res.status(200).json(response);
  })
}

export default WarehouseController;
