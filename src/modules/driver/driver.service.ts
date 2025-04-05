import { Driver, DriverPaginate, DriverType } from './driver.model';
import { DriverInput } from './driver.interface';
import { PaginationModel, PaginationOptions } from 'mongoose-paginate-ts';
import { assertUnique } from '../../utils/assertUniqueness';

export class DriverService {
  async index(
    options: PaginationOptions
  ): Promise<PaginationModel<DriverType> | undefined> {
    return await DriverPaginate.paginate(options);
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

