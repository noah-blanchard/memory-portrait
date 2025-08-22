'use client';

import { Stack } from '@mantine/core';
import type { BookingGrouped } from '@/schemas/bookingGrouped';
import { STATUS_ORDER, type BookingStatus } from '../statusTheme';
import BookingsGroup from './BookingsGroups';

export default function BookingsGroupedView({
  data,
  onChangeStatus,
}: {
  data: BookingGrouped;
  onChangeStatus: (uid: string, from: BookingStatus, to: BookingStatus) => Promise<void>;
}) {
  return (
    <Stack gap="xl">
      {STATUS_ORDER.map((s) => (
        <BookingsGroup
          key={s}
          status={s}
          items={data[s]}
          onChangeStatus={onChangeStatus}
        />
      ))}
    </Stack>
  );
}
