import { SuccessResponseSchema } from "../../interfaces/apiResponse";
import { buildPaginationOptions } from "../../utils/buildPaginationOptions";
import catchAsync from "../../utils/catchAsync";
import { MRequest, MResponse } from "../../types/express";
import { AuthMiddlewareService } from "../../middleware/authMiddleware";
import VendorService from "./vendors.service";
import { VendorType } from "./vendors.model";
import { vendorPartialSchema, vendorSchema } from "./vendors.interface";
import { vendorAggregates, vendorQueries } from "./vendors.query";


class VendorController {
  vendorService = new VendorService();
  authMiddlewareService = new AuthMiddlewareService();

  index = catchAsync(async (req: MRequest, res: MResponse) => {
    const options = buildPaginationOptions(req, {
      allowedQueryFields: vendorQueries,
      predefinedAggregates: vendorAggregates,
    });

    const vendors = await this.vendorService.index(options);
    const response = SuccessResponseSchema.parse({
      message: "Vendors fetched successfully",
      data: vendors,
    });
    res.status(200).json(response);
  })

  show = catchAsync(async (req: MRequest, res: MResponse) => {
    const user = req.foundDoc as VendorType;
    const vendorId = user._id;
    const options = buildPaginationOptions(req, {
      allowedQueryFields: vendorQueries,
      predefinedAggregates: vendorAggregates,
      mode: "single",
    });
    const vendor = await this.vendorService.show(vendorId, options);
    const response = SuccessResponseSchema.parse({
      message: "Vendor fetched successfully",
      data: vendor,
    });
    res.status(200).json(response);
  })

  create = catchAsync(async (req: MRequest, res: MResponse) => {
    const parsedPayload = vendorSchema.parse(req.body);
    const vendor = await this.vendorService.create(parsedPayload);
    const response = SuccessResponseSchema.parse({
      message: "Vendor created successfully",
      data: vendor,
    });
    res.status(201).json(response);
  })

  update = catchAsync(async (req: MRequest, res: MResponse) => {
    const user = req.foundDoc as VendorType;
    const vendorId = user._id;
    const parsedPayload = vendorPartialSchema.parse(req.body);
    const vendor = await this.vendorService.update(vendorId, parsedPayload);
    const response = SuccessResponseSchema.parse({
      message: "Vendor updated successfully",
      data: vendor,
    });
    res.status(200).json(response);
  })

  delete = catchAsync(async (req: MRequest, res: MResponse) => {
    const user = req.foundDoc as VendorType;
    const vendorId = user._id;
    const vendor = await this.vendorService.delete(vendorId);
    const response = SuccessResponseSchema.parse({
      message: "Vendor deleted successfully",
      data: vendor,
    });
    res.status(200).json(response);
  })
}

export default VendorController;
