import mongoose from 'mongoose';
import { z } from 'zod';

export const downtimeSchema = z.object({
  vehicleId: z.string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid ObjectId",
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),
  reason: z.string().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
});

export const downtimePartialSchema = downtimeSchema.partial();
export const createDowntimeSchema = downtimeSchema.omit({ endTime: true });

export type CreateDowntimeInput = z.infer<typeof createDowntimeSchema>;
export type DowntimeInput = z.infer<typeof downtimeSchema>;

