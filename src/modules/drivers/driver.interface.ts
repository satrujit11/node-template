import { z } from 'zod';


export const emergencyContactSchema = z.object({
  name: z.string().min(1, 'POC name is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  aadharNumber: z.string().min(12, 'Aadhaar number is required').optional(),
  aadharFile: z.string().optional(),
});


export const driverSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  mobileNumber: z.string().min(10, 'Mobile number is required'),
  addressLine1: z.string().min(1, 'Address Line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(5, 'Pincode is required'),
  aadharNumber: z.string().min(12, 'Aadhaar number is required'),
  aadharFile: z.string().optional(),
  panNumber: z.string().min(10, 'PAN number is required'),
  panFile: z.string().optional(),
  dlNumber: z.string().optional(),
  dlFile: z.string().optional(),
  riderPhoto: z.string().optional(),


  vehicleRentDeduction: z
    .union([z.string(), z.number()])
    .transform((value) => Number(value)),  // Auto-converts to number
  accommodationDeduction: z
    .union([z.string(), z.number()])
    .transform((value) => Number(value)),
  emergencyContacts: z.array(emergencyContactSchema).min(2, 'At least 2 POCs are required'),
});

export const driverPartialSchema = driverSchema.partial();

export type DriverInput = z.infer<typeof driverSchema>;
export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>;

