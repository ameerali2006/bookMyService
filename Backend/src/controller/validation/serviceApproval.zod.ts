import { z } from "zod";

export const ApprovalSchema = z.object({
  bookingId: z.string().min(1),
  serviceName: z.string().min(1),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "endTime must be in HH:mm format"),
  additionalItems: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.number().min(0),
      })
    )
    .optional(),
  additionalNotes: z.string().optional(),
});

export type ApprovalData = z.infer<typeof ApprovalSchema>;
