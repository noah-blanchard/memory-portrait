'use client';

import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { ActionIcon, Collapse, Group, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { Badge, Divider, Text } from '@/components/I18nUI/I18nUI';
import type { BookingRequestsRow } from '@/types/db-rows';
import { STATUS_META, type BookingStatus } from '../statusTheme';
import BookingCard from './BookingCard';
import StatusBadge from './StatusBadge';

export default function BookingsGroup({
  status,
  items,
  defaultOpened,
  onChangeStatus,
}: {
  status: BookingStatus;
  items: Omit<BookingRequestsRow, 'id'>[];
  defaultOpened?: boolean;
  onChangeStatus: (uid: string, from: BookingStatus, to: BookingStatus) => Promise<void>;
}) {
  const meta = STATUS_META[status];

  const [opened, setOpened] = useLocalStorage<boolean>({
    key: `bookings-group-open-${status}`,
    defaultValue:
      defaultOpened ?? (items.length > 0 && (status === 'pending' || status === 'reviewed')),
  });

  const toggle = () => setOpened((o) => !o);

  return (
    <Stack gap="xs">
      <Group justify="space-between" wrap="nowrap">
        <Group gap="xs" wrap="nowrap" onClick={toggle} style={{ cursor: 'pointer' }}>
          <StatusBadge status={status} />
          <Badge color={meta.color} variant="light">
            {items.length}
          </Badge>
        </Group>
        <ActionIcon variant="subtle" aria-label={opened ? 'Collapse' : 'Expand'} onClick={toggle}>
          {opened ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
        </ActionIcon>
      </Group>

      <Divider variant="dashed" />

      <Collapse in={opened}>
        <Stack gap="sm" pt="xs">
          {items.length === 0 ? (
            <Text c="dimmed" size="sm">
              admin_no_requests
            </Text>
          ) : (
            items.map((row) => (
              <BookingCard key={row.request_uid} row={row} onChangeStatus={onChangeStatus} />
            ))
          )}
        </Stack>
      </Collapse>
    </Stack>
  );
}
