import { z } from 'zod';

export const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  vehicleRCNumber: z.string().min(1, 'Vehicle RC number is required'),
  VIN: z.string().min(1, 'VIN is required'),
});

export const vehiclePartialSchema = vehicleSchema.partial();

export type VehicleInput = z.infer<typeof vehicleSchema>;
