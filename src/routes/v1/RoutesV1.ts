import { Router } from "express";
import routerDriver from "../../modules/drivers/driver.router";
import routerVehicle from "../../modules/vehicles/vehicle.router";
import routerDowntime from "../../modules/downtimes/downtime.router";
import routerRideHistory from "../../modules/rideHistory/rideHistory.router";

const routerV1 = Router()

routerV1.use("/drivers", routerDriver)
routerV1.use("/vehicles", routerVehicle)
routerV1.use("/downtimes", routerDowntime)
routerV1.use("/rideHistory", routerRideHistory)

export default routerV1;

