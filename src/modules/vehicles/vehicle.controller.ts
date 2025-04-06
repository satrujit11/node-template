import { SuccessResponseSchema } from "../../interfaces/apiResponse";
import { buildPaginationOptions } from "../../utils/buildPaginationOptions";
import catchAsync from "../../utils/catchAsync";
import { vehiclePartialSchema, vehicleSchema } from "./vehicle.interface";
import { vehicleAggregates, vehicleQueries } from "./vehicle.query";
import { Request, Response } from "express";
import VehicleService from "./vehicle.service";


class VehicleController {
  vehicleService = new VehicleService();

  index = catchAsync(async (req: Request, res: Response) => {
    const options = buildPaginationOptions(req, {
      allowedQueryFields: vehicleQueries,
      predefinedAggregates: vehicleAggregates,
    });
    const vehicles = await this.vehicleService.index(options);
    const response = SuccessResponseSchema.parse({
      message: "Vehicles fetched successfully",
      data: vehicles,
    });
    res.status(200).json(response);
  })

  show = catchAsync(async (req: Request, res: Response) => {
    const vehicleId = req.params._id;
    const options = buildPaginationOptions(req, {
      allowedQueryFields: vehicleQueries,
      predefinedAggregates: vehicleAggregates,
      mode: "single",
    });
    const vehicle = await this.vehicleService.show(vehicleId, options);
    const response = SuccessResponseSchema.parse({
      message: "Vehicle fetched successfully",
      data: vehicle,
    });
    res.status(200).json(response);
  })

  create = catchAsync(async (req: Request, res: Response) => {
    const parsedPayload = vehicleSchema.parse(req.body);
    const vehicle = await this.vehicleService.create(parsedPayload);
    const response = SuccessResponseSchema.parse({
      message: "Vehicle created successfully",
      data: vehicle,
    });
    res.status(201).json(response);
  })

  update = catchAsync(async (req: Request, res: Response) => {
    const vehicleId = req.params._id;
    const parsedPayload = vehiclePartialSchema.parse(req.body);
    const vehicle = await this.vehicleService.update(vehicleId, parsedPayload);
    const response = SuccessResponseSchema.parse({
      message: "Vehicle updated successfully",
      data: vehicle,
    });
    res.status(200).json(response);
  })

  delete = catchAsync(async (req: Request, res: Response) => {
    const vehicleId = req.params._id;
    const vehicle = await this.vehicleService.delete(vehicleId);
    const response = SuccessResponseSchema.parse({
      message: "Vehicle deleted successfully",
      data: vehicle,
    });
    res.status(200).json(response);
  })


}

export default VehicleController;
