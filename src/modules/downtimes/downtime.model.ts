import mongoose from "mongoose";
import { DowntimeInput } from "./downtime.interface";
import { mongoosePagination, Pagination } from "mongoose-paginate-ts";

export interface DowntimeType extends DowntimeInput, mongoose.Document { }

const downtimeSchema = new mongoose.Schema<DowntimeType>({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  reason: { type: String },
  startTime: { type: Date, required: true, default: Date.now },
  endTime: { type: Date },
}, {
  timestamps: true,
});

downtimeSchema.plugin(mongoosePagination);

export const Downtime = mongoose.model<DowntimeType>('Downtime', downtimeSchema);
export const DowntimePaginate: Pagination<DowntimeType> = mongoose.model<DowntimeType, Pagination<DowntimeType>>('Downtime', downtimeSchema);

