import { z } from "zod"

export const SuccessResponseSchema = z.object({
  message: z.string().optional(),
  data: z.unknown(),
})

export const ErrorResponseSchema = z.object({
  message: z.string().optional(),
  error: z.object({
    code: z.string(),
    details: z.unknown().optional(),
  })
})

export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
