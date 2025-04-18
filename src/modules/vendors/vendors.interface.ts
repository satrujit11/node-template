import { z } from 'zod';

export const pocSchema = z.object({
  name: z.string().min(1, 'POC name is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
});

export const vendorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  GSTIN: z.string().min(1, 'GSTIN is required'),
  address: z.string().min(1, 'Address is required'),
  POCs: z.array(pocSchema).min(3, 'At least 3 POCs are required'),
});

export const vendorPartialSchema = vendorSchema.partial();

export type VendorInput = z.infer<typeof vendorSchema>;
export type POCInput = z.infer<typeof pocSchema>;

