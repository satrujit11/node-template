import mongoose from 'mongoose';
import { DriverInput } from './driver.interface';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';

export interface DriverType extends DriverInput, mongoose.Document { }

const driverSchema = new mongoose.Schema<DriverType>({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  aadharNumber: { type: String, required: true },
  panNumber: { type: String, required: true },
  dlNumber: { type: String },

  vehicleRentDeduction: { type: Number, default: 6000 },
  accommodationDeduction: { type: Number, default: 2000 },

  // aadharFile: { type: String },
  // riderPhoto: { type: String },
  // panFile: { type: String },
  // dlFile: { type: String },
}, {
  timestamps: true
});

driverSchema.plugin(mongoosePagination)

export const Driver = mongoose.model<DriverType>('Driver', driverSchema);
export const DriverPaginate: Pagination<DriverType> = mongoose.model<DriverType, Pagination<DriverType>>('Driver', driverSchema);

