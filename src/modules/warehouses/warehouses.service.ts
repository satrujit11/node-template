import { PaginationModel, PaginationOptions } from 'mongoose-paginate-ts';
import mongoose from 'mongoose';
import { Warehouse, WarehousePaginate, WarehouseType } from '../warehouses/warehouses.model';
import { WarehouseInput } from '../warehouses/warehouses.interface';

class WarehouseService {
  async index(
    options: PaginationOptions
  ): Promise<PaginationModel<WarehouseType> | undefined> {
    return await WarehousePaginate.paginate(options);
  }

  async show(warehouseId: string, options: PaginationOptions): Promise<WarehouseType | null> {
    if (options.aggregate) {
      const aggregateResult = await Warehouse.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(warehouseId) } },
        ...options.aggregate
      ]);

      if (!aggregateResult.length) return null;

      const warehouseDoc = new Warehouse(aggregateResult[0]);
      if (options.populate) {
        await warehouseDoc.populate(options.populate);
      }
      return warehouseDoc;
    }
    return await Warehouse.findById(warehouseId, options).exec();
  }

  async create(warehouseData: WarehouseInput): Promise<WarehouseType> {
    const warehouse = new Warehouse(warehouseData);
    return await warehouse.save();
  }

  async update(
    warehouseId: string,
    updateData: Partial<WarehouseInput>
  ): Promise<WarehouseType | null> {
    return await Warehouse.findByIdAndUpdate(warehouseId, updateData, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async delete(warehouseId: string): Promise<WarehouseType | null> {
    return await Warehouse.findByIdAndDelete(warehouseId).exec();
  }
}

export default WarehouseService;

