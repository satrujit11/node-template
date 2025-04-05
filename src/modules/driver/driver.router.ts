import { Router } from "express";
import DriverController from "./driver.controller";
import { checkUnique } from "../../middleware/uniqueHandler";
import { Driver } from "./driver.model";

const routerDriver = Router();
const driverController = new DriverController();

const checkUniqueMobileNumber = checkUnique(Driver, "mobileNumber", "body", "Mobile number already exists")

routerDriver.get("/", driverController.index);
routerDriver.post("/", checkUniqueMobileNumber, driverController.create);
routerDriver.patch("/:id", driverController.update);
routerDriver.delete("/:id", driverController.delete);

export default routerDriver;
