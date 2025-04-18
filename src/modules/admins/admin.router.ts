import { Router } from "express";
import AdminUserController from "./admin.controller";
import { checkExists, checkUnique } from "../../middleware/middlewareHandler";
import { AdminUser } from "./admin.model";
import AdminMiddleware from "./admin.middleware";
import FileUploadHandler from "../../config/file-upload";

// Controllers
const adminController = new AdminUserController();

// Middlewares
const adminMiddleware = new AdminMiddleware()
const fileUploadHandler = new FileUploadHandler('../public/uploads')
const checkUniqueMobileNumber = checkUnique(AdminUser, "mobileNumber", "body", "Mobile number already exists")
const checkAdminUserExists = checkExists(AdminUser, "_id", "params", "AdminUser not found")
const checkAdminUserExistsWithMobileNumber = checkExists(AdminUser, "mobileNumber", "body", "AdminUser not found")
const checkAdminUserExistsWithMobileNumberInParam = checkExists(AdminUser, "mobileNumber", "params", "AdminUser not found")

// Routes
const routerAdminUser = Router();

routerAdminUser.get("/", adminMiddleware.isAdmin, adminController.index);
routerAdminUser.post("/", checkUniqueMobileNumber, adminMiddleware.isAdmin, adminMiddleware.createPassword, fileUploadHandler.handleFileUploads(), adminController.create);
routerAdminUser.get("/:_id", checkAdminUserExists, adminMiddleware.isAdmin, adminMiddleware.createPassword, adminController.show);
routerAdminUser.patch("/:_id", checkAdminUserExists, adminMiddleware.isAdmin, adminMiddleware.createPassword, fileUploadHandler.handleFileUploads(), adminController.update);
routerAdminUser.delete("/:_id", checkAdminUserExists, adminMiddleware.isAdmin, adminController.delete);

export default routerAdminUser;


export const routerUnauthenticated = Router();

routerUnauthenticated.post("/", checkAdminUserExistsWithMobileNumber, adminMiddleware.comparePassword, adminController.login);
routerUnauthenticated.get("/:mobileNumber", checkAdminUserExistsWithMobileNumberInParam, adminMiddleware.removeProtectedInfo, adminController.show);


