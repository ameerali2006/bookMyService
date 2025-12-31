import { z } from 'zod';

export const workerProfileUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .optional(),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Phone must be 10 digits')
    .optional(),

  experience: z
    .enum(['0-1', '2-5', '6-10', '10+'], { message: 'Invalid experience range' })
    .optional(),
  fees: z
    .number()
    .min(0, 'Fees cannot be negative')
    .max(10000, 'Fees cannot exceed ₹10,000')
    .optional(),
  profileImage: z
    .string()

    .optional(),
});
