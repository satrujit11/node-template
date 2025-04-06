import { NextFunction } from "express";
import { downtimePartialSchema } from "./downtime.interface";
import { Downtime, DowntimeType } from "./downtime.model";
import { ErrorResponseSchema } from "../../interfaces/apiResponse";
import { ErrorCodes } from "../../constants/errorCode.enum";
import { MRequest, MResponse } from "../../types/express";

class DowntimeMiddleware {
  async activeDowntimeExists(req: MRequest, res: MResponse, next: NextFunction) {
    const parsedBody = downtimePartialSchema.parse(req.body);
    const { vehicleId } = parsedBody;

    const activeDowntime = await Downtime.findOne({
      vehicleId,
      endTime: { $exists: false }, // OR use: endTime: null
    });

    if (!activeDowntime) {
      return res.status(404).json(
        ErrorResponseSchema.parse({
          message: "Active downtime not found",
          error: {
            code: ErrorCodes.NOT_FOUND,
            details: { vehicleId },
          },
        })
      );
    }

    req.foundDoc = activeDowntime as DowntimeType;

    next();
  }
}

export default DowntimeMiddleware;
