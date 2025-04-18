import mongoose from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
import { WarehouseInput } from './warehouses.interface';
import { pocSchema, POCType } from '../vendors/vendors.model';

export interface WarehouseType extends WarehouseInput, mongoose.Document { }

const warehouseSchema = new mongoose.Schema<WarehouseType>({
  name: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  POCs: {
    type: [pocSchema],
    validate: {
      validator: function(value: POCType[]) {
        return value.length >= 1;
      },
      message: 'At least 1 POCs are required',
    },
  },
}, {
  timestamps: true
});

warehouseSchema.plugin(mongoosePagination)

export const Warehouse = mongoose.model<WarehouseType>('Warehouse', warehouseSchema);
export const WarehousePaginate: Pagination<WarehouseType> = mongoose.model<WarehouseType, Pagination<WarehouseType>>('Warehouse', warehouseSchema);

