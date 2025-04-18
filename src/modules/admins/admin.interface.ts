import { z } from 'zod';

export const adminUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  mobileNumber: z.string().min(10, "Mobile number is required"),
  aadharNumber: z.string().min(12, "Adhaar number is required"),
  aadharFile: z.string().optional(),
  type: z.enum(["admin", "user"]).default("user"),
  initialPasswordReset: z.boolean().default(false),
  password: z.string(),
});

export const adminUserPartialSchema = adminUserSchema.partial();
export type AdminUserInput = z.infer<typeof adminUserSchema>;


