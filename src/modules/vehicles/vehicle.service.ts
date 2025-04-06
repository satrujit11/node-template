import { Vehicle, VehiclePaginate, VehicleType } from './vehicle.model';
import { VehicleInput } from './vehicle.interface';
import { PaginationModel, PaginationOptions } from 'mongoose-paginate-ts';
import mongoose from 'mongoose';

class VehicleService {
  async index(
    options: PaginationOptions
  ): Promise<PaginationModel<VehicleType> | undefined> {
    return await VehiclePaginate.paginate(options);
  }

  async show(vehicleId: string, options: PaginationOptions): Promise<VehicleInput | null> {
    if (options.aggregate) {
      const aggregateResult = await Vehicle.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(vehicleId) } },
        ...options.aggregate
      ]);

      if (!aggregateResult.length) return null;

      const vehicleDoc = new Vehicle(aggregateResult[0]);
      if (options.populate) {
        await vehicleDoc.populate(options.populate);
      }
      return vehicleDoc;
    }
    return await Vehicle.findById(vehicleId, options).exec();
  }

  async create(vehicleData: VehicleInput): Promise<VehicleInput> {
    const vehicle = new Vehicle(vehicleData);
    return await vehicle.save();
  }

  async update(
    vehicleId: string,
    updateData: Partial<VehicleInput>
  ): Promise<VehicleInput | null> {
    return await Vehicle.findByIdAndUpdate(vehicleId, updateData, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async delete(vehicleId: string): Promise<VehicleInput | null> {
    return await Vehicle.findByIdAndDelete(vehicleId).exec();
  }
}

export default VehicleService;
