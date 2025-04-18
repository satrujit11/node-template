import { Router } from "express";
import VendorController from "./vendors.controller";
import { checkExists } from "../../middleware/middlewareHandler";
import { Vendor } from "./vendors.model";

// Controllers
const vendorController = new VendorController();

// Middlewares
const checkVendorExists = checkExists(Vendor, "_id", "params", "Vendor not found")

// Routes
const routerVendor = Router();

routerVendor.get("/", vendorController.index);
routerVendor.post("/", vendorController.create);
routerVendor.get("/:_id", checkVendorExists, vendorController.show);
routerVendor.patch("/:_id", checkVendorExists, vendorController.update);
routerVendor.delete("/:_id", checkVendorExists, vendorController.delete);

export default routerVendor;
