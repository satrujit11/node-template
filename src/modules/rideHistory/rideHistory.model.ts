import mongoose from "mongoose";
import { RideHistoryInput } from "./rideHistory.interface";
import { mongoosePagination, Pagination } from "mongoose-paginate-ts";

export interface RideHistoryType extends RideHistoryInput, mongoose.Document { }

const rideHistorySchema = new mongoose.Schema<RideHistoryType>({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
  startTime: { type: Date, required: true, default: Date.now },
  endTime: { type: Date },
}, {
  timestamps: true,
});

rideHistorySchema.plugin(mongoosePagination);

export const RideHistory = mongoose.model<RideHistoryType>('RideHistory', rideHistorySchema);
export const RideHistoryPaginate: Pagination<RideHistoryType> = mongoose.model<RideHistoryType, Pagination<RideHistoryType>>('RideHistory', rideHistorySchema);

