import { Driver, DriverPaginate, DriverType } from './driver.model';
import { DriverInput } from './driver.interface';
import { PaginationModel, PaginationOptions } from 'mongoose-paginate-ts';
import mongoose from 'mongoose';

export class DriverService {
  async index(
    options: PaginationOptions
  ): Promise<PaginationModel<DriverType> | undefined> {
    return await DriverPaginate.paginate(options);
  }

  async show(driverId: string, options: PaginationOptions): Promise<DriverInput | null> {
    if (options.aggregate) {
      const aggregateResult = await Driver.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(driverId) } },
        ...options.aggregate
      ]);

      if (!aggregateResult.length) return null;

      const driverDoc = new Driver(aggregateResult[0]);
      if (options.populate) {
        await driverDoc.populate(options.populate);
      }
      return driverDoc;
    }
    return await Driver.findById(driverId, options).exec();
  }

  async create(driverData: DriverInput): Promise<DriverInput> {
    const driver = new Driver(driverData);
    return await driver.save();
  }

  async update(
    driverId: string,
    updateData: Partial<DriverInput>
  ): Promise<DriverInput | null> {
    return await Driver.findByIdAndUpdate(driverId, updateData, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async delete(driverId: string): Promise<DriverInput | null> {
    return await Driver.findByIdAndDelete(driverId).exec();
  }
}

