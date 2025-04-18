import mongoose from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
import { POCInput, VendorInput } from './vendors.interface';

export interface VendorType extends VendorInput, mongoose.Document { }
export interface POCType extends POCInput, mongoose.Document { }

export const pocSchema = new mongoose.Schema<POCType>({
  name: { type: String, required: true },
  contactNumber: { type: String, required: true },
});


const vendorSchema = new mongoose.Schema<VendorType>({
  name: { type: String, required: true },
  GSTIN: { type: String, required: true },
  address: { type: String, required: true },
  POCs: {
    type: [pocSchema],
    validate: {
      validator: function(value: POCType[]) {
        return value.length >= 3;
      },
      message: 'At least 3 POCs are required',
    },
  },
}, {
  timestamps: true
});

vendorSchema.plugin(mongoosePagination)

export const Vendor = mongoose.model<VendorType>('Vendor', vendorSchema);
export const VendorPaginate: Pagination<VendorType> = mongoose.model<VendorType, Pagination<VendorType>>('Vendor', vendorSchema);

