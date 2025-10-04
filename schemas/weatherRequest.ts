import { z } from 'zod';

export const weatherRequestSchema = z.object({
  location: z.string().min(1, 'Location is required').max(100, 'Location too long'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export type WeatherRequestInput = z.infer<typeof weatherRequestSchema>;
