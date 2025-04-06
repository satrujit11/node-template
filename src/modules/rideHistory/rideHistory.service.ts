import { RideHistory, RideHistoryPaginate, RideHistoryType } from './rideHistory.model';
import { CreateRideHistoryInput, RideHistoryInput } from './rideHistory.interface';
import { PaginationModel, PaginationOptions } from 'mongoose-paginate-ts';
import mongoose from 'mongoose';

class RideHistoryService {
  async index(
    options: PaginationOptions
  ): Promise<PaginationModel<RideHistoryType> | undefined> {
    return await RideHistoryPaginate.paginate(options);
  }

  async show(rideHistoryId: string, options: PaginationOptions): Promise<RideHistoryInput | null> {
    if (options.aggregate) {
      const aggregateResult = await RideHistory.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(rideHistoryId) } },
        ...options.aggregate
      ]);

      if (!aggregateResult.length) return null;

      const rideHistoryDoc = new RideHistory(aggregateResult[0]);
      if (options.populate) {
        await rideHistoryDoc.populate(options.populate);
      }
      return rideHistoryDoc;
    }
    return await RideHistory.findById(rideHistoryId, options).exec();
  }

  async create(rideHistoryData: CreateRideHistoryInput): Promise<RideHistoryInput> {
    const rideHistory = new RideHistory(rideHistoryData);
    return await rideHistory.save();
  }

  async update(
    rideHistoryId: string,
    updateData: Partial<RideHistoryInput>
  ): Promise<RideHistoryInput | null> {
    return await RideHistory.findByIdAndUpdate(rideHistoryId, updateData, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async delete(rideHistoryId: string): Promise<RideHistoryInput | null> {
    return await RideHistory.findByIdAndDelete(rideHistoryId).exec();
  }
}

export default RideHistoryService;


