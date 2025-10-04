import { z } from 'zod';
import { BookingStatusEnum } from './bookingGrouped'; // réutilise ton enum

export const bookingStatusUpdateSchema = z.object({
  requestUid: z.uuid(),
  status: BookingStatusEnum,
});

export type BookingStatusUpdateInput = z.infer<typeof bookingStatusUpdateSchema>;
