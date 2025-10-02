'use client';

import { Badge } from '@/components/I18nUI/I18nUI';
import { STATUS_META, type BookingStatus } from '../statusTheme';

export default function StatusBadge({ status }: { status: BookingStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge color={meta.color} variant="light" leftSection={<meta.Icon size={14} />} radius="sm">
      {meta.label}
    </Badge>
  );
}
