import { NextFunction } from "express";
import { rideHistoryPartialSchema } from "./rideHistory.interface";
import { RideHistory, RideHistoryType } from "./rideHistory.model";
import { ErrorResponseSchema } from "../../interfaces/apiResponse";
import { ErrorCodes } from "../../constants/errorCode.enum";
import { MRequest, MResponse } from "../../types/express";

class RideHistoryMiddleware {
  async activeRideHistoryExists(req: MRequest, res: MResponse, next: NextFunction) {
    const parsedBody = rideHistoryPartialSchema.parse(req.body);
    const { vehicleId } = parsedBody;

    const activeRideHistory = await RideHistory.findOne({
      vehicleId,
      endTime: { $exists: false }, // OR use: endTime: null
    });

    if (!activeRideHistory) {
      return res.status(404).json(
        ErrorResponseSchema.parse({
          message: "Active rideHistory not found",
          error: {
            code: ErrorCodes.NOT_FOUND,
            details: { vehicleId },
          },
        })
      );
    }
    req.foundDoc = activeRideHistory as RideHistoryType;
    next();
  }

  async endPreviousRideHistoryOfVehicle(req: MRequest, _res: MResponse, next: NextFunction) {
    const parsedBody = rideHistoryPartialSchema.parse(req.body);
    const { vehicleId } = parsedBody;
    const previousRideHistory = await RideHistory.findOne({
      vehicleId,
      endTime: { $exists: false }, // OR use: endTime: null
    });
    if (previousRideHistory) {
      await RideHistory.updateOne(
        { _id: previousRideHistory._id },
        { $set: { endTime: new Date() } }
      );
    }
    next();
  }
}

export default RideHistoryMiddleware;

