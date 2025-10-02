import {
  IconBan,
  IconCircleCheck,
  IconCircleX,
  IconHourglassHigh,
  IconSearch,
  type Icon as TablerIcon,
} from '@tabler/icons-react';
import type { BookingStatus } from '@/types/components';

// Re-export for backward compatibility
export type { BookingStatus };

export interface StatusMeta {
  label: string;
  color: string; // Mantine color key, ex: "green"
  Icon: TablerIcon;
}

export const STATUS_META: Record<BookingStatus, StatusMeta> = {
  pending: { label: 'status_pending', color: 'yellow', Icon: IconHourglassHigh },
  reviewed: { label: 'status_reviewed', color: 'blue', Icon: IconSearch },
  approved: { label: 'status_approved', color: 'green', Icon: IconCircleCheck },
  rejected: { label: 'status_rejected', color: 'red', Icon: IconCircleX },
  cancelled: { label: 'status_cancelled', color: 'gray', Icon: IconBan },
};

export const STATUS_ORDER: BookingStatus[] = [
  'pending',
  'reviewed',
  'approved',
  'rejected',
  'cancelled',
];
