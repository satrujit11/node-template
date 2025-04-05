import { SuccessResponseSchema } from "../../types/apiResponse";
import { buildPaginationOptions } from "../../utils/buildPaginationOptions";
import catchAsync from "../../utils/catchAsync";
import { driverPartialSchema, driverSchema } from "./driver.interface";
import { driverAggregates, driverQueries } from "./driver.query";
import { DriverService } from "./driver.service";
import { Request, Response } from "express";


class DriverController {
  driverService = new DriverService();

  index = catchAsync(async (req: Request, res: Response) => {
    const options = buildPaginationOptions(req, {
      allowedQueryFields: driverQueries,
      predefinedAggregates: driverAggregates,
    });
    const drivers = await this.driverService.index(options);
    const response = SuccessResponseSchema.parse({
      message: "Drivers fetched successfully",
      data: drivers,
    });
    res.status(200).json(response);
  })

  show = catchAsync(async (req: Request, res: Response) => {
    const driverId = req.params._id;
    const options = buildPaginationOptions(req, {
      allowedQueryFields: driverQueries,
      predefinedAggregates: driverAggregates,
      mode: "single",
    });
    const driver = await this.driverService.show(driverId, options);
    const response = SuccessResponseSchema.parse({
      message: "Driver fetched successfully",
      data: driver,
    });
    res.status(200).json(response);
  })

  create = catchAsync(async (req: Request, res: Response) => {
    const parsedPayload = driverSchema.parse(req.body);
    const driver = await this.driverService.create(parsedPayload);
    const response = SuccessResponseSchema.parse({
      message: "Driver created successfully",
      data: driver,
    });
    res.status(201).json(response);
  })

  update = catchAsync(async (req: Request, res: Response) => {
    const driverId = req.params._id;
    const parsedPayload = driverPartialSchema.parse(req.body);
    const driver = await this.driverService.update(driverId, parsedPayload);
    const response = SuccessResponseSchema.parse({
      message: "Driver updated successfully",
      data: driver,
    });
    res.status(200).json(response);
  })

  delete = catchAsync(async (req: Request, res: Response) => {
    const driverId = req.params._id;
    const driver = await this.driverService.delete(driverId);
    const response = SuccessResponseSchema.parse({
      message: "Driver deleted successfully",
      data: driver,
    });
    res.status(200).json(response);
  })


}

export default DriverController;
