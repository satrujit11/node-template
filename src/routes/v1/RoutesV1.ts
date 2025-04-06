import { Router } from "express";
import routerDriver from "../../modules/drivers/driver.router";
import routerVehicle from "../../modules/vehicles/vehicle.router";
import routerDowntime from "../../modules/downtimes/downtime.router";

const routerV1 = Router()

routerV1.use("/drivers", routerDriver)
routerV1.use("/vehicles", routerVehicle)
routerV1.use("/downtimes", routerDowntime)

export default routerV1;

