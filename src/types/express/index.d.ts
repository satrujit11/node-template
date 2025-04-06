import { Request, Response } from "express";

export interface MRequest extends Request {
  userId?: string;
  foundDoc?: unknown;
}

export interface MResponse extends Response { }

