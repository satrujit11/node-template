import { Router } from "express";
import RideHistoryController from "./rideHistory.controller";
import { checkExists } from "../../middleware/middlewareHandler";
import { RideHistory } from "./rideHistory.model";
import { Vehicle } from "../vehicles/vehicle.model";
import RideHistoryMiddleware from "./rideHistory.middleware";

// Controllers 
const rideHistoryController = new RideHistoryController();

// Middlewares
const rideHistoryMiddleware = new RideHistoryMiddleware();
const checkRiderHistoryExists = checkExists(RideHistory, "_id", "params", "RiderHistory not found")
const checkVehicleExists = checkExists(Vehicle, "_id", "body", "Vehicle not found", "vehicleId")

// Routes
const routerRideHistory = Router();

routerRideHistory.get("/", rideHistoryController.index);
routerRideHistory.post("/", checkVehicleExists, rideHistoryMiddleware.endPreviousRideHistoryOfVehicle, rideHistoryController.create);
routerRideHistory.get("/:_id", checkRiderHistoryExists, rideHistoryController.show);
routerRideHistory.patch("/:_id?", checkRiderHistoryExists, checkVehicleExists, rideHistoryMiddleware.activeRideHistoryExists, rideHistoryController.update);
routerRideHistory.delete("/:_id", checkRiderHistoryExists, rideHistoryController.delete);

export default routerRideHistory;


