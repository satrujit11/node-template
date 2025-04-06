import { SuccessResponseSchema } from "../../interfaces/apiResponse";
import { buildPaginationOptions } from "../../utils/buildPaginationOptions";
import catchAsync from "../../utils/catchAsync";
import { createDowntimeSchema, downtimePartialSchema } from "./downtime.interface";
import { downtimeAggregates, downtimeQueries } from "./downtime.query";
import DowntimeService from "./downtime.service";
import { MRequest, MResponse } from "../../types/express";
import { DowntimeType } from "./downtime.model";

class DowntimeController {
  downtimeService = new DowntimeService();

  index = catchAsync(async (req: MRequest, res: MResponse) => {
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

  show = catchAsync(async (req: MRequest, res: MResponse) => {
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

  create = catchAsync(async (req: MRequest, res: MResponse) => {
    const parsedPayload = createDowntimeSchema.parse(req.body);
    const downtime = await this.downtimeService.create(parsedPayload);
    const response = SuccessResponseSchema.parse({
      message: "Downtime created successfully",
      data: downtime,
    });
    res.status(201).json(response);
  })

  update = catchAsync(async (req: MRequest, res: MResponse) => {
    const parsedPayload = downtimePartialSchema.parse(req.body);
    const downtime = req.foundDoc as DowntimeType;
    const updatedDowntime = await this.downtimeService.update(downtime._id, parsedPayload);
    const response = SuccessResponseSchema.parse({
      message: "Downtime updated successfully",
      data: updatedDowntime,
    });
    res.status(200).json(response);
  });


  delete = catchAsync(async (req: MRequest, res: MResponse) => {
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

