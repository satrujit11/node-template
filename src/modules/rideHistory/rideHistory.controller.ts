import { SuccessResponseSchema } from "../../interfaces/apiResponse";
import { buildPaginationOptions } from "../../utils/buildPaginationOptions";
import catchAsync from "../../utils/catchAsync";
import { createRideHistorySchema, rideHistoryPartialSchema } from "./rideHistory.interface";
import { rideHistoryAggregates, rideHistoryQueries } from "./rideHistory.query";
import { Request, Response } from "express";
import RideHistoryService from "./rideHistory.service";


class RideHistoryController {
  rideHistoryService = new RideHistoryService();

  index = catchAsync(async (req: Request, res: Response) => {
    const options = buildPaginationOptions(req, {
      allowedQueryFields: rideHistoryQueries,
      predefinedAggregates: rideHistoryAggregates,
    });
    const rideHistorys = await this.rideHistoryService.index(options);
    const response = SuccessResponseSchema.parse({
      message: "RideHistorys fetched successfully",
      data: rideHistorys,
    });
    res.status(200).json(response);
  })

  show = catchAsync(async (req: Request, res: Response) => {
    const rideHistoryId = req.params._id;
    const options = buildPaginationOptions(req, {
      allowedQueryFields: rideHistoryQueries,
      predefinedAggregates: rideHistoryAggregates,
      mode: "single",
    });
    const rideHistory = await this.rideHistoryService.show(rideHistoryId, options);
    const response = SuccessResponseSchema.parse({
      message: "RideHistory fetched successfully",
      data: rideHistory,
    });
    res.status(200).json(response);
  })

  create = catchAsync(async (req: Request, res: Response) => {
    const parsedPayload = createRideHistorySchema.parse(req.body);
    const rideHistory = await this.rideHistoryService.create(parsedPayload);
    const response = SuccessResponseSchema.parse({
      message: "RideHistory created successfully",
      data: rideHistory,
    });
    res.status(201).json(response);
  })

  update = catchAsync(async (req: Request, res: Response) => {
    const rideHistoryId = req.params._id;
    const parsedPayload = rideHistoryPartialSchema.parse(req.body);
    const rideHistory = await this.rideHistoryService.update(rideHistoryId, parsedPayload);
    const response = SuccessResponseSchema.parse({
      message: "RideHistory updated successfully",
      data: rideHistory,
    });
    res.status(200).json(response);
  })

  delete = catchAsync(async (req: Request, res: Response) => {
    const rideHistoryId = req.params._id;
    const rideHistory = await this.rideHistoryService.delete(rideHistoryId);
    const response = SuccessResponseSchema.parse({
      message: "RideHistory deleted successfully",
      data: rideHistory,
    });
    res.status(200).json(response);
  })


}

export default RideHistoryController;


