import { AdminUser, AdminUserPaginate, AdminUserType } from './admin.model';
import { AdminUserInput } from './admin.interface';
import { PaginationModel, PaginationOptions } from 'mongoose-paginate-ts';
import mongoose from 'mongoose';

class AdminUserService {
  async index(
    options: PaginationOptions
  ): Promise<PaginationModel<AdminUserType> | undefined> {
    return await AdminUserPaginate.paginate(options);
  }

  async show(adminId: string, options: PaginationOptions): Promise<AdminUserType | null> {
    if (options.aggregate) {
      const aggregateResult = await AdminUser.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(adminId) } },
        ...options.aggregate
      ]);

      if (!aggregateResult.length) return null;

      const adminDoc = new AdminUser(aggregateResult[0]);
      if (options.populate) {
        await adminDoc.populate(options.populate);
      }
      return adminDoc;
    }
    return await AdminUser.findById(adminId, options).exec();
  }

  async create(adminData: AdminUserInput): Promise<AdminUserType> {
    const admin = new AdminUser(adminData);
    return await admin.save();
  }

  async update(
    adminId: string,
    updateData: Partial<AdminUserInput>
  ): Promise<AdminUserType | null> {
    return await AdminUser.findByIdAndUpdate(adminId, updateData, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async delete(adminId: string): Promise<AdminUserType | null> {
    return await AdminUser.findByIdAndDelete(adminId).exec();
  }
}

export default AdminUserService;
