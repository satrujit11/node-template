import { Request, Response, NextFunction } from "express";
import { downtimePartialSchema } from "./downtime.interface";
import { Downtime } from "./downtime.model";
import { ErrorResponseSchema } from "../../interfaces/apiResponse";
import { ErrorCodes } from "../../constants/errorCode.enum";

class DowntimeMiddleware {
  async activeDowntimeExists(req: Request, res: Response, next: NextFunction) {
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
            code: "NOT_FOUND",
            details: { vehicleId },
          },
        })
      );
    }

    next();
  }
}

export default DowntimeMiddleware;
