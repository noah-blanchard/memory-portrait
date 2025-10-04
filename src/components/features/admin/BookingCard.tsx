'use client';

import {
  IconDots,
  IconCheck,
  IconEye,
  IconX,
  IconCalendar,
  IconMapPin,
  IconUser,
} from '@tabler/icons-react';
import {
  Group,
  Paper,
  Stack,
  ActionIcon,
  Menu,
  ThemeIcon,
  Avatar,
  Text,
} from '@mantine/core';
import { useUpdateBookingStatus } from '@/lib/api/hooks';
import type { BookingStatus } from '@/types/components';

interface BookingCardProps {
  booking: {
    request_uid: string;
    client_name: string;
    contact: string;
    starts_at: string | null;
    location: string | null;
    people_count: number;
    budget_cents: number | null;
    status: BookingStatus;
  };
}


export default function BookingCard({ booking }: BookingCardProps) {
  const updateStatusMutation = useUpdateBookingStatus();

  const changeStatus = async (from: BookingStatus, to: BookingStatus): Promise<void> => {
    if (from === to) { return; }
    await updateStatusMutation.mutateAsync({ requestUid: booking.request_uid, status: to });
  };

  const isUpdating = updateStatusMutation.isPending;

  const formatDate = (dateString: string | null) => {
    if (!dateString) { return 'Not set'; }
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatMoney = (cents: number | null) => {
    if (!cents) { return 'Not set'; }
    return `$${(cents / 100).toFixed(2)} CAD`;
  };

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="sm">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Group gap="sm">
            <Avatar size="md" color="ocean" radius="md">
              {booking.client_name?.charAt(0) || 'U'}
            </Avatar>
            <div>
              <Text fw={600} size="sm">
                {booking.client_name}
              </Text>
              <Text size="xs" c="dimmed">
                {booking.contact}
              </Text>
            </div>
          </Group>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                radius="md"
                loading={isUpdating}
                disabled={isUpdating}
              >
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Change Status</Menu.Label>
              {booking.status === 'pending' && (
                <>
                  <Menu.Item leftSection={<IconEye size={16} />} onClick={() => changeStatus('pending', 'reviewed')}>
                    Mark as Reviewed
                  </Menu.Item>
                  <Menu.Item leftSection={<IconCheck size={16} />} onClick={() => changeStatus('pending', 'approved')}>
                    Approve
                  </Menu.Item>
                  <Menu.Item leftSection={<IconX size={16} />} color="red" onClick={() => changeStatus('pending', 'rejected')}>
                    Reject
                  </Menu.Item>
                </>
              )}
              {booking.status === 'reviewed' && (
                <>
                  <Menu.Item leftSection={<IconCheck size={16} />} onClick={() => changeStatus('reviewed', 'approved')}>
                    Approve
                  </Menu.Item>
                  <Menu.Item leftSection={<IconX size={16} />} color="red" onClick={() => changeStatus('reviewed', 'rejected')}>
                    Reject
                  </Menu.Item>
                </>
              )}
              {booking.status === 'approved' && (
                <>
                  <Menu.Item leftSection={<IconEye size={16} />} onClick={() => changeStatus('approved', 'reviewed')}>
                    Mark as Reviewed
                  </Menu.Item>
                  <Menu.Item leftSection={<IconX size={16} />} color="red" onClick={() => changeStatus('approved', 'rejected')}>
                    Reject
                  </Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>

        {/* Details */}
        <Stack gap="xs">
          <Group gap="xs">
            <ThemeIcon size="sm" variant="light" color="blue">
              <IconCalendar size={14} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">
              {formatDate(booking.starts_at)}
            </Text>
          </Group>
          
          <Group gap="xs">
            <ThemeIcon size="sm" variant="light" color="purple">
              <IconMapPin size={14} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">
              {booking.location || 'Not specified'}
            </Text>
          </Group>

          <Group gap="xs">
            <ThemeIcon size="sm" variant="light" color="green">
              <IconUser size={14} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">
              {booking.people_count} people
            </Text>
          </Group>

          {booking.budget_cents && (
            <Group gap="xs">
              <ThemeIcon size="sm" variant="light" color="orange">
                <Text size="xs">$</Text>
              </ThemeIcon>
              <Text size="xs" c="dimmed">
                {formatMoney(booking.budget_cents)}
              </Text>
            </Group>
          )}
        </Stack>

        {/* Footer */}
        <Text size="xs" c="dimmed">
          ID: {booking.request_uid.slice(0, 8)}...
        </Text>
      </Stack>
    </Paper>
  );
}
