import { PaginationModel, PaginationOptions } from 'mongoose-paginate-ts';
import mongoose from 'mongoose';
import { Vendor, VendorPaginate, VendorType } from './vendors.model';
import { VendorInput } from './vendors.interface';

class VendorService {
  async index(
    options: PaginationOptions
  ): Promise<PaginationModel<VendorType> | undefined> {
    return await VendorPaginate.paginate(options);
  }

  async show(vendorId: string, options: PaginationOptions): Promise<VendorType | null> {
    if (options.aggregate) {
      const aggregateResult = await Vendor.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(vendorId) } },
        ...options.aggregate
      ]);

      if (!aggregateResult.length) return null;

      const vendorDoc = new Vendor(aggregateResult[0]);
      if (options.populate) {
        await vendorDoc.populate(options.populate);
      }
      return vendorDoc;
    }
    return await Vendor.findById(vendorId, options).exec();
  }

  async create(vendorData: VendorInput): Promise<VendorType> {
    const vendor = new Vendor(vendorData);
    return await vendor.save();
  }

  async update(
    vendorId: string,
    updateData: Partial<VendorInput>
  ): Promise<VendorType | null> {
    return await Vendor.findByIdAndUpdate(vendorId, updateData, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async delete(vendorId: string): Promise<VendorType | null> {
    return await Vendor.findByIdAndDelete(vendorId).exec();
  }
}

export default VendorService;

