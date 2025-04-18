import { Request, Response } from "express";
import { AdminUserType } from "../../modules/admins/admin.model";

export interface MRequest extends Request {
  user?: AdminUserType;
  foundDoc?: unknown;
}

export interface MResponse extends Response { }

