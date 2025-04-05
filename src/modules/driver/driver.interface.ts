import { z } from 'zod';

export const driverSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  mobileNumber: z.string().min(10, 'Mobile number is required'),
  addressLine1: z.string().min(1, 'Address Line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(5, 'Pincode is required'),
  aadharNumber: z.string().min(1, 'Aadhaar number is required'),
  panNumber: z.string().min(1, 'PAN number is required'),
  dlNumber: z.string().optional(),

  vehicleRentDeduction: z.number().default(0),
  accommodationDeduction: z.number().default(0),

  // // File paths (to be added post-upload)
  // aadharFile: z.string().optional(),
  // riderPhoto: z.string().optional(),
  // panFile: z.string().optional(),
  // dlFile: z.string().optional(),
});

export const driverPartialSchema = driverSchema.partial();

export type DriverInput = z.infer<typeof driverSchema>;

