import { Router } from "express";
import routerDriver from "../../modules/drivers/driver.router";
import routerVehicle from "../../modules/vehicles/vehicle.router";
import routerDowntime from "../../modules/downtimes/downtime.router";
import routerRideHistory from "../../modules/rideHistory/rideHistory.router";
import routerAdminUser, { routerUnauthenticated } from "../../modules/admins/admin.router";
import { AuthMiddlewareService } from "../../middleware/authMiddleware";
import routerVendor from "../../modules/vendors/vendors.router";
import routerWarehouse from "../../modules/warehouses/warehouses.router";

const authMiddleware = new AuthMiddlewareService();


const routerV1 = Router()

// Public routes
routerV1.use("/login", routerUnauthenticated)

// Auth Validation middleware
routerV1.use(authMiddleware.validateAccessToken)

// Private routes
routerV1.use("/drivers", routerDriver)
routerV1.use("/vehicles", routerVehicle)
routerV1.use("/downtimes", routerDowntime)
routerV1.use("/rideHistory", routerRideHistory)
routerV1.use("/admins", routerAdminUser)
routerV1.use("/vendors", routerVendor)
routerV1.use("/warehouses", routerWarehouse)


export default routerV1;

