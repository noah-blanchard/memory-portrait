'use client';

import { Badge } from '@/components/I18nUI/I18nUI';
import type { BookingStatus } from '@/types/components';
import { STATUS_META } from '../statusTheme';

export interface StatusBadgeProps {
  status: BookingStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const meta = STATUS_META[status];
  return (
    <Badge color={meta.color} variant="light" leftSection={<meta.Icon size={14} />} radius="sm">
      {meta.label}
    </Badge>
  );
}
