import { z } from 'zod';

export const ContactMethods = ['email', 'wechat', 'instagram', 'phone'] as const;
export const PhotoshootTypes = [
  'tourism',
  'linkedin',
  'event',
  'family',
  'portrait',
  'product',
] as const;
export const BookingStatuses = [
  'pending',
  'approved',
  'cancelled',
  'reviewed',
  'rejected',
] as const;

export const ContactMethodEnum = z.enum(ContactMethods);
export const PhotoshootTypeEnum = z.enum(PhotoshootTypes);
export const BookingStatusEnum = z.enum(BookingStatuses);
