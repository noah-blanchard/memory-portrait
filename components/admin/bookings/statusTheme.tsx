import { z } from 'zod';
import {
  IconHourglassHigh,
  IconSearch,
  IconCircleCheck,
  IconCircleX,
  IconBan,
  type Icon as TablerIcon,
} from '@tabler/icons-react';
import { BookingStatusEnum } from '@/schemas/bookingGrouped';

export type BookingStatus = z.infer<typeof BookingStatusEnum>;
export type StatusMeta = {
  label: string;
  color: string; // Mantine color key, ex: "green"
  Icon: TablerIcon;
};

export const STATUS_META: Record<BookingStatus, StatusMeta> = {
  pending:   { label: 'Pending',   color: 'yellow', Icon: IconHourglassHigh },
  reviewed:  { label: 'Reviewed',  color: 'blue',   Icon: IconSearch },
  approved:  { label: 'Approved',  color: 'green',  Icon: IconCircleCheck },
  rejected:  { label: 'Rejected',  color: 'red',    Icon: IconCircleX },
  cancelled: { label: 'Cancelled', color: 'gray',   Icon: IconBan },
};

export const STATUS_ORDER: BookingStatus[] = [
  'pending',
  'reviewed',
  'approved',
  'rejected',
  'cancelled',
];
