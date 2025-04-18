import { Router } from "express";
import DriverController from "./driver.controller";
import { checkExists, checkUnique } from "../../middleware/middlewareHandler";
import { Driver } from "./driver.model";
import FileUploadHandler from "../../config/file-upload";

// Controllers
const driverController = new DriverController();

// Middlewares
const fileUploadHandler = new FileUploadHandler('../public/uploads')
const checkUniqueMobileNumber = checkUnique(Driver, "mobileNumber", "body", "Mobile number already exists")
const checkDriverExists = checkExists(Driver, "_id", "params", "Driver not found")

// Routes
const routerDriver = Router();

routerDriver.get("/", driverController.index);
routerDriver.post("/", checkUniqueMobileNumber, fileUploadHandler.handleFileUploads(), driverController.create);
routerDriver.get("/:_id", checkDriverExists, driverController.show);
routerDriver.patch("/:_id", checkDriverExists, fileUploadHandler.handleFileUploads(), driverController.update);
routerDriver.delete("/:_id", checkDriverExists, driverController.delete);

export default routerDriver;
