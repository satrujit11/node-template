import mongoose from "mongoose";
import { VehicleInput } from "./vehicle.interface";
import { mongoosePagination, Pagination } from "mongoose-paginate-ts";

export interface VehicleType extends VehicleInput, mongoose.Document { }

const vehicleSchema = new mongoose.Schema<VehicleType>({
  make: { type: String, required: true },
  vehicleRCNumber: { type: String, required: true },
  VIN: { type: String, required: true },
}, {
  timestamps: true
});

vehicleSchema.plugin(mongoosePagination)

export const Vehicle = mongoose.model<VehicleType>('Vehicle', vehicleSchema);
export const VehiclePaginate: Pagination<VehicleType> = mongoose.model<VehicleType, Pagination<VehicleType>>('Vehicle', vehicleSchema);
