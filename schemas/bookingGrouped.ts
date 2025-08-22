import { z } from 'zod';
import { ContactMethodEnum, PhotoshootTypeEnum } from '@/schemas/enums';

// booking_status enum de ta BDD
export const BookingStatusEnum = z.enum([
  'pending',
  'reviewed',
  'approved',
  'rejected',
  'cancelled',
]);

// Une ligne de booking_requests telle que renvoyée par la RPC
export const bookingRowSchema = z.object({
  request_uid: z.uuid(),
  client_name: z.string(),
  photoshoot_kind: PhotoshootTypeEnum,

  // Postgres -> JSON : range en string, timestamps en ISO string
  requested_period: z.string(),

  starts_at: z.iso.datetime({
    offset: true,
  }),
  ends_at: z.iso.datetime({
    offset: true,
  }),

  location: z.string().nullable(),
  people_count: z.number().int().gte(1),

  language: z.string().nullable(),
  budget_cents: z.number().int().nonnegative().nullable(),
  notes: z.string().nullable(),

  status: BookingStatusEnum,
  created_at: z.iso.datetime({
    offset: true,
  }),
  updated_at: z.iso.datetime({
    offset: true,
  }),

  contact_method: ContactMethodEnum,
  contact: z.string(),
});

// Résultat de la fonction booking_requests_grouped_by_status()
export const bookingGroupedSchema = z.object({
  pending: z.array(bookingRowSchema),
  reviewed: z.array(bookingRowSchema),
  approved: z.array(bookingRowSchema),
  rejected: z.array(bookingRowSchema),
  cancelled: z.array(bookingRowSchema),
});

export type BookingGrouped = z.infer<typeof bookingGroupedSchema>;
