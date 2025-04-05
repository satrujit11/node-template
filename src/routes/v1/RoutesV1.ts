import { Router } from "express";
import routerDriver from "../../modules/driver/driver.router";

const routerV1 = Router()

routerV1.use("/drivers", routerDriver)

export default routerV1;

