'use client';

import { Badge } from '@mantine/core';
import { STATUS_META, type BookingStatus } from '../statusTheme';

export default function StatusBadge({ status }: { status: BookingStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge
      color={meta.color}
      variant="light"
      leftSection={<meta.Icon size={14} />}
      radius="sm"
    >
      {meta.label}
    </Badge>
  );
}
