import { Downtime, DowntimePaginate, DowntimeType } from './downtime.model';
import { CreateDowntimeInput, DowntimeInput } from './downtime.interface';
import { PaginationModel, PaginationOptions } from 'mongoose-paginate-ts';
import mongoose from 'mongoose';

class DowntimeService {
  async index(
    options: PaginationOptions
  ): Promise<PaginationModel<DowntimeType> | undefined> {
    return await DowntimePaginate.paginate(options);
  }

  async show(downtimeId: string, options: PaginationOptions): Promise<DowntimeInput | null> {
    if (options.aggregate) {
      const aggregateResult = await Downtime.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(downtimeId) } },
        ...options.aggregate
      ]);

      if (!aggregateResult.length) return null;

      const downtimeDoc = new Downtime(aggregateResult[0]);
      if (options.populate) {
        await downtimeDoc.populate(options.populate);
      }
      return downtimeDoc;
    }
    return await Downtime.findById(downtimeId, options).exec();
  }

  async create(downtimeData: CreateDowntimeInput): Promise<DowntimeInput> {
    const downtime = new Downtime(downtimeData);
    return await downtime.save();
  }

  async update(
    downtimeId: string,
    updateData: Partial<DowntimeInput>
  ): Promise<DowntimeInput | null> {
    return await Downtime.findByIdAndUpdate(downtimeId, updateData, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async delete(downtimeId: string): Promise<DowntimeInput | null> {
    return await Downtime.findByIdAndDelete(downtimeId).exec();
  }
}

export default DowntimeService;

