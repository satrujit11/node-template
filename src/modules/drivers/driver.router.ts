import { Router } from "express";
import DriverController from "./driver.controller";
import { checkExists, checkUnique } from "../../middleware/middlewareHandler";
import { Driver } from "./driver.model";

// Controllers
const driverController = new DriverController();

// Middlewares
const checkUniqueMobileNumber = checkUnique(Driver, "mobileNumber", "body", "Mobile number already exists")
const checkDriverExists = checkExists(Driver, "_id", "params", "Driver not found")

// Routes
const routerDriver = Router();

routerDriver.get("/", driverController.index);
routerDriver.post("/", checkUniqueMobileNumber, driverController.create);
routerDriver.get("/:_id", checkDriverExists, driverController.show);
routerDriver.patch("/:_id", checkDriverExists, driverController.update);
routerDriver.delete("/:_id", checkDriverExists, driverController.delete);

export default routerDriver;
