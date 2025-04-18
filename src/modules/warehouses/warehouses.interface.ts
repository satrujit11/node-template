import { z } from 'zod';
import { pocSchema } from '../vendors/vendors.interface';

export const warehouseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  addressLine1: z.string().min(1, 'Address Line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(5, 'Pincode is required'),
  POCs: z.array(pocSchema).min(1, 'At least 1 POCs are required'),
});

export const warehousePartialSchema = warehouseSchema.partial();

export type WarehouseInput = z.infer<typeof warehouseSchema>;

