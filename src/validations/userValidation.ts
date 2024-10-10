import { z } from "zod";
import { UserRoles } from "../constants/enums/userEnum";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});


export const registerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  role: z.nativeEnum(UserRoles, { message: "Invalid role selected" })
});

export const refreshAccessTokenSchema = z.object({
  refreshToken: z.string().min(1, { message: "Refresh Token is required" }),
  userId: z.string().optional()
});
