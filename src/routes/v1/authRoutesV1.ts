import { Router } from "express";
import { login, refreshAccessToken, register } from "../../controller/authController";

const authRouterV1 = Router();

authRouterV1.post("/login", login);
authRouterV1.post("/register", register);
authRouterV1.post("/refresh-token", refreshAccessToken);

export default authRouterV1;

