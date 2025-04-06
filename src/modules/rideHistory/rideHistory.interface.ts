import mongoose from 'mongoose';
import { z } from 'zod';

export const rideHistorySchema = z.object({
  vehicleId: z.string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid ObjectId",
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),
  driverId: z.string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid ObjectId",
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
});

export const rideHistoryPartialSchema = rideHistorySchema.partial();
export const createRideHistorySchema = rideHistorySchema.omit({ endTime: true });

export type CreateRideHistoryInput = z.infer<typeof createRideHistorySchema>;
export type RideHistoryInput = z.infer<typeof rideHistorySchema>;
