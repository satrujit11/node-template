import { SuccessResponseSchema } from "../../interfaces/apiResponse";
import { buildPaginationOptions } from "../../utils/buildPaginationOptions";
import catchAsync from "../../utils/catchAsync";
import { createDowntimeSchema, downtimePartialSchema, downtimeSchema } from "./downtime.interface";
import { downtimeAggregates, downtimeQueries } from "./downtime.query";
import { Request, Response } from "express";
import DowntimeService from "./downtime.service";
import mongoose, { Schema } from "mongoose";
import { Downtime } from "./downtime.model";


class DowntimeController {
  downtimeService = new DowntimeService();

  index = catchAsync(async (req: Request, res: Response) => {
    const options = buildPaginationOptions(req, {
      allowedQueryFields: downtimeQueries,
      predefinedAggregates: downtimeAggregates,
    });
    const downtimes = await this.downtimeService.index(options);
    const response = SuccessResponseSchema.parse({
      message: "Downtimes fetched successfully",
      data: downtimes,
    });
    res.status(200).json(response);
  })

  show = catchAsync(async (req: Request, res: Response) => {
    const downtimeId = req.params._id;
    const options = buildPaginationOptions(req, {
      allowedQueryFields: downtimeQueries,
      predefinedAggregates: downtimeAggregates,
      mode: "single",
    });
    const downtime = await this.downtimeService.show(downtimeId, options);
    const response = SuccessResponseSchema.parse({
      message: "Downtime fetched successfully",
      data: downtime,
    });
    res.status(200).json(response);
  })

  create = catchAsync(async (req: Request, res: Response) => {
    const parsedPayload = createDowntimeSchema.parse(req.body);
    const downtime = await this.downtimeService.create(parsedPayload);
    const response = SuccessResponseSchema.parse({
      message: "Downtime created successfully",
      data: downtime,
    });
    res.status(201).json(response);
  })

  update = catchAsync(async (req: Request, res: Response) => {
    const parsedPayload = downtimePartialSchema.parse(req.body);
    const { vehicleId } = parsedPayload;
    const { _id } = req.params;

    let downtime;

    if (_id) {
      downtime = await this.downtimeService.update(_id, parsedPayload);
    } else if (vehicleId) {
      downtime = await this.downtimeService.updateActiveByVehicle(vehicleId, parsedPayload);
    } else {
      throw new Error("Either downtimeId (in params) or vehicleId (in body) must be provided.");
    }

    const response = SuccessResponseSchema.parse({
      message: "Downtime updated successfully",
      data: downtime,
    });
    res.status(200).json(response);
  });


  delete = catchAsync(async (req: Request, res: Response) => {
    const downtimeId = req.params._id;
    const downtime = await this.downtimeService.delete(downtimeId);
    const response = SuccessResponseSchema.parse({
      message: "Downtime deleted successfully",
      data: downtime,
    });
    res.status(200).json(response);
  })


}

export default DowntimeController;

