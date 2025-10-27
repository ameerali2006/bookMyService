import { z } from 'zod';

export const envSchema = z.object({
  VITE_SERVER_BASEURL: z.string().url(),
  VITE_GOOGLE_CLIENT_ID: z.string().min(10),
  
});
