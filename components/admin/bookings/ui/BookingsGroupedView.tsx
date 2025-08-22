'use client';

import { Stack } from '@mantine/core';
import type { BookingGrouped } from '@/schemas/bookingGrouped';
import { STATUS_ORDER } from '../statusTheme';
import BookingsGroup from './BookingsGroups';

export default function BookingsGroupedView({ data }: { data: BookingGrouped }) {
  return (
    <Stack gap="xl">
      {STATUS_ORDER.map((s) => (
        <BookingsGroup key={s} status={s} items={data[s]} />
      ))}
    </Stack>
  );
}
