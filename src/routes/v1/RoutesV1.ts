import { Router } from "express";
import authRouterV1 from "./authRoutesV1";

const routerV1 = Router()

routerV1.use("/auth", authRouterV1)

export default routerV1;

