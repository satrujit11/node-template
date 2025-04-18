import { Router } from "express";
import WarehouseController from "./warehouses.controller";
import { checkExists } from "../../middleware/middlewareHandler";
import { Warehouse } from "./warehouses.model";

// Controllers
const warehouseController = new WarehouseController();

// Middlewares
const checkWarehouseExists = checkExists(Warehouse, "_id", "params", "Warehouse not found")

// Routes
const routerWarehouse = Router();

routerWarehouse.get("/", warehouseController.index);
routerWarehouse.post("/", warehouseController.create);
routerWarehouse.get("/:_id", checkWarehouseExists, warehouseController.show);
routerWarehouse.patch("/:_id", checkWarehouseExists, warehouseController.update);
routerWarehouse.delete("/:_id", checkWarehouseExists, warehouseController.delete);

export default routerWarehouse;
