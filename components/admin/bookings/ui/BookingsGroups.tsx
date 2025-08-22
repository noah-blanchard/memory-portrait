'use client';

import { useLocalStorage } from '@mantine/hooks';
import {
  ActionIcon,
  Badge,
  Collapse,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

import type { BookingRequestsRow } from '@/types/db-rows';
import { STATUS_META, type BookingStatus } from '../statusTheme';
import StatusBadge from './StatusBadge';
import BookingCard from './BookingCard';

export default function BookingsGroup({
  status,
  items,
  defaultOpened,
}: {
  status: BookingStatus;
  items: Omit<BookingRequestsRow, 'id'>[];
  /** optional: override initial state */
  defaultOpened?: boolean;
}) {
  const meta = STATUS_META[status];

  const [opened, setOpened] = useLocalStorage<boolean>({
    key: `bookings-group-open-${status}`,
    defaultValue:
      defaultOpened ??
      // sensible defaults: open if has items and is a “hot” status
      (items.length > 0 && (status === 'pending' || status === 'reviewed')),
  });

  const toggle = () => setOpened((o) => !o);

  return (
    <Stack gap="xs">
      {/* Header */}
      <Group justify="space-between" wrap="nowrap">
        <Group gap="xs" wrap="nowrap" onClick={toggle} style={{ cursor: 'pointer' }}>
          {/* <Title order={4}>{meta.label}</Title> */}
          <StatusBadge status={status} />
          <Badge color={meta.color} variant="light">
            {items.length}
          </Badge>
        </Group>

        <ActionIcon
          variant="subtle"
          aria-label={opened ? 'Collapse' : 'Expand'}
          onClick={toggle}
        >
          {opened ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
        </ActionIcon>
      </Group>

      <Divider variant="dashed" />

      {/* Body */}
      <Collapse in={opened}>
        <Stack gap="sm" pt="xs">
          {items.length === 0 ? (
            <Text c="dimmed" size="sm">
              No requests
            </Text>
          ) : (
            items.map((row) => <BookingCard key={row.request_uid} row={row} />)
          )}
        </Stack>
      </Collapse>
    </Stack>
  );
}
