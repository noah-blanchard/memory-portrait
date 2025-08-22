'use client';

import dayjs from 'dayjs';
import {
  IconCalendar,
  IconCamera,
  IconCheck,
  IconClock,
  IconCopy,
  IconHash,
  IconMapPin,
  IconNote,
  IconUsers,
} from '@tabler/icons-react';
import { ActionIcon, Card, CopyButton, Divider, Group, Stack, Text, Tooltip } from '@mantine/core';
import type { BookingRequestsRow } from '@/types/db-rows';
import ContactPill from './ContactPill';
import StatusBadge from './StatusBadge';

export default function BookingCard({ row }: { row: Omit<BookingRequestsRow, 'id'> }) {
  const start = dayjs(row.starts_at);
  const end = dayjs(row.ends_at);

  return (
    <Card withBorder radius="md" shadow="xs" p="md">
      <Stack gap="xs">
        {/* header */}
        <Group justify="space-between" wrap="nowrap">
          <Text fw={700} truncate>
            {row.client_name}
          </Text>
          <StatusBadge status={row.status} />
        </Group>

        <Group gap="xs" wrap="nowrap">
          <IconHash size={14} />
          <Text size="xs" c="dimmed" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {row.request_uid}
          </Text>

          <CopyButton value={row.request_uid}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy ID'} withArrow>
                <ActionIcon size="sm" variant="subtle" onClick={copy}>
                  {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>

        <Divider my={4} />

        {/* infos principales */}
        <Stack gap={6}>
          <Line icon={<IconCamera size={16} />} label="Type" value={cap(row.photoshoot_kind)} />
          {row.location && (
            <Line icon={<IconMapPin size={16} />} label="Location" value={row.location} />
          )}
          <Line icon={<IconUsers size={16} />} label="People" value={String(row.people_count)} />
        </Stack>

        <Divider my={4} />

        {/* dates/heures */}
        <Stack gap={6} style={{ fontVariantNumeric: 'tabular-nums' }}>
          <Line icon={<IconCalendar size={16} />} label="Date" value={start.format('YYYY-MM-DD')} />
          <Line icon={<IconClock size={16} />} label="Start" value={start.format('HH:mm')} />
          <Line icon={<IconClock size={16} />} label="End" value={end.format('HH:mm')} />
        </Stack>

        <Group mt="xs">
          <ContactPill method={row.contact_method} value={row.contact} />
        </Group>

        {row.notes && (
          <>
            <Divider my={4} />
            <Group gap="xs" align="flex-start">
              <IconNote size={16} />
              <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                {row.notes}
              </Text>
            </Group>
          </>
        )}
      </Stack>
    </Card>
  );
}

function Line({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Group gap={8} wrap="nowrap" justify="space-between" align="flex-start">
      <Group gap={6} wrap="nowrap">
        {icon}
        <Text size="sm" c="dimmed">
          {label}
        </Text>
      </Group>
      <Text size="sm" fw={500} ml="auto" ta="right">
        {value}
      </Text>
    </Group>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
