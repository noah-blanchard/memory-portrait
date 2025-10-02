'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import {
  IconBan,
  IconCalendar,
  IconCamera,
  IconCheck,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconCopy,
  IconDots,
  IconHash,
  IconHourglassHigh,
  IconMapPin,
  IconNote,
  IconSearch,
  IconUsers,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Card, CopyButton, Group, Stack } from '@mantine/core';
import { Button, Divider, Menu, Text, Tooltip } from '@/components/I18nUI/I18nUI';
import type { BookingRequestsRow } from '@/types/db-rows';
import { STATUS_META, STATUS_ORDER, type BookingStatus } from '../statusTheme';
import ContactPill from './ContactPill';
import StatusBadge from './StatusBadge';

export default function BookingCard({
  row,
  onChangeStatus,
}: {
  row: Omit<BookingRequestsRow, 'id'>;
  onChangeStatus: (uid: string, from: BookingStatus, to: BookingStatus) => Promise<void>;
}) {
  const { t } = useTranslation('common');
  const start = dayjs(row.starts_at);
  const end = dayjs(row.ends_at);
  const [changing, setChanging] = useState(false);

  const handleSelect = async (to: BookingStatus) => {
    if (to === row.status) {
      return;
    }
    setChanging(true);
    try {
      await onChangeStatus(row.request_uid, row.status as BookingStatus, to);
    } finally {
      setChanging(false);
    }
  };

  return (
    <Card withBorder radius="md" shadow="xs" p="md">
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap" align="center">
          <Text fw={700} truncate>
            {row.client_name}
          </Text>
          <Group gap="xs">
            <StatusBadge status={row.status as BookingStatus} />
            <Menu withinPortal position="bottom-end" shadow="md">
              <Menu.Target>
                <Button
                  variant="subtle"
                  size="compact-sm"
                  radius="md"
                  leftSection={<IconDots size={16} />}
                  loading={changing}
                >
                  common_change
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>admin_set_status</Menu.Label>
                {STATUS_ORDER.map((s) => {
                  const meta = STATUS_META[s];
                  const left =
                    s === 'approved' ? (
                      <IconCircleCheck size={16} />
                    ) : s === 'rejected' ? (
                      <IconCircleX size={16} />
                    ) : s === 'cancelled' ? (
                      <IconBan size={16} />
                    ) : s === 'reviewed' ? (
                      <IconSearch size={16} />
                    ) : (
                      <IconHourglassHigh size={16} />
                    );

                  return (
                    <Menu.Item
                      key={s}
                      leftSection={left}
                      onClick={() => handleSelect(s)}
                      disabled={changing || s === row.status}
                      color={meta.color}
                    >
                      {meta.label}
                    </Menu.Item>
                  );
                })}
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>

        <Group gap="xs" wrap="nowrap">
          <IconHash size={14} />
          <Text size="xs" c="dimmed" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {row.request_uid}
          </Text>
          <CopyButton value={row.request_uid}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'copied' : 'copy_id'} withArrow>
                <ActionIcon size="sm" variant="subtle" onClick={copy}>
                  {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>

        <Divider my={4} />

        <Stack gap={6}>
          <Line
            icon={<IconCamera size={16} />}
            label={t('booking_type')}
            value={cap(row.photoshoot_kind)}
          />
          {row.location && (
            <Line
              icon={<IconMapPin size={16} />}
              label={t('booking_location')}
              value={row.location}
            />
          )}
          <Line
            icon={<IconUsers size={16} />}
            label={t('booking_people')}
            value={String(row.people_count)}
          />
        </Stack>

        <Divider my={4} />

        <Stack gap={6} style={{ fontVariantNumeric: 'tabular-nums' }}>
          <Line
            icon={<IconCalendar size={16} />}
            label={t('booking_date')}
            value={start.format('YYYY-MM-DD')}
          />
          <Line
            icon={<IconClock size={16} />}
            label={t('booking_start')}
            value={start.format('HH:mm')}
          />
          <Line
            icon={<IconClock size={16} />}
            label={t('booking_end')}
            value={end.format('HH:mm')}
          />
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
