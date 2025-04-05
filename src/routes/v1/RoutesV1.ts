import { Router } from "express";
import routerDriver from "../../modules/drivers/driver.router";

const routerV1 = Router()

routerV1.use("/drivers", routerDriver)

export default routerV1;

