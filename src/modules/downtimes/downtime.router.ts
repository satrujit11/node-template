import { Router } from "express";
import DowntimeController from "./downtime.controller";
import { checkExists } from "../../middleware/middlewareHandler";
import { Downtime } from "./downtime.model";
import { Vehicle } from "../vehicles/vehicle.model";
import DowntimeMiddleware from "./downtime.middleware";

// Controllers 
const downtimeController = new DowntimeController();

// Middlewares
const downtimeMiddleware = new DowntimeMiddleware();
const checkDowntimeExists = checkExists(Downtime, "_id", "params", "Downtime not found")
const checkVehicleExists = checkExists(Vehicle, "_id", "body", "Vehicle not found", "vehicleId")

// Routes
const routerDowntime = Router();

routerDowntime.get("/", downtimeController.index);
routerDowntime.post("/", checkVehicleExists, downtimeController.create);
routerDowntime.get("/:_id", checkDowntimeExists, downtimeController.show);
routerDowntime.patch("/:_id?", checkDowntimeExists, checkVehicleExists, downtimeMiddleware.activeDowntimeExists, downtimeController.update);
routerDowntime.delete("/:_id", checkDowntimeExists, downtimeController.delete);

export default routerDowntime;

