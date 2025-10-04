'use client';

import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Title, Text, Button as I18nButton } from '@/components/I18nUI/I18nUI';
import { Paper, Stack, Group, ThemeIcon, SimpleGrid, Center, Loader } from '@mantine/core';
import { IconCalendar, IconClock, IconCheck, IconX, IconEye, IconArrowRight } from '@tabler/icons-react';
import { useBookings } from '@/lib/api/hooks';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { data: bookings, isLoading, error } = useBookings();
  const router = useRouter();

  // Calculate booking statistics
  const stats = {
    total: bookings ? Object.values(bookings).flat().length : 0,
    pending: bookings?.pending?.length || 0,
    reviewed: bookings?.reviewed?.length || 0,
    approved: bookings?.approved?.length || 0,
    rejected: bookings?.rejected?.length || 0,
  };
  return (
    <AdminLayout>
      <Stack gap="lg">
        <Paper withBorder radius="md" p="lg">
          <Title order={1}>Admin Dashboard</Title>
          <Text c="dimmed" mt="sm">
            Welcome to the Memory Studio admin panel
          </Text>
        </Paper>

        <Paper withBorder radius="md" p="lg">
          <Title order={3} mb="md">Quick Actions</Title>
          <Group gap="md">
            <Paper withBorder radius="md" p="md" style={{ flex: 1 }}>
              <Group justify="space-between" align="flex-start">
                <Group gap="sm">
                  <ThemeIcon size="lg" variant="light" color="blue">
                    <IconCalendar size={24} />
                  </ThemeIcon>
                  <div>
                    <Title order={4}>Bookings</Title>
                    <Text size="sm" c="dimmed">Manage booking requests</Text>
                  </div>
                </Group>
                <I18nButton
                  variant="light"
                  color="blue"
                  rightSection={<IconArrowRight size={16} />}
                  onClick={() => router.push('/admin-bookings')}
                >
                  Go to Bookings
                </I18nButton>
              </Group>
            </Paper>

            {/* Settings
            <Paper withBorder radius="md" p="md" style={{ flex: 1 }}>
              <Group justify="space-between" align="flex-start">
                <Group gap="sm">
                  <ThemeIcon size="lg" variant="light" color="green">
                    <IconSettings size={24} />
                  </ThemeIcon>
                  <div>
                    <Title order={4}>Settings</Title>
                    <Text size="sm" c="dimmed">Configure system settings</Text>
                  </div>
                </Group>
                <I18nButton
                  variant="light"
                  color="green"
                  rightSection={<IconArrowRight size={16} />}
                  onClick={() => router.push('/admin-settings')}
                >
                  Go to Settings
                </I18nButton>
              </Group>
            </Paper>
            */}
          </Group>
        </Paper>

        {/* Booking Statistics */}
        <Paper withBorder radius="md" p="lg">
          <Title order={3} mb="md">Booking Statistics</Title>
          {isLoading ? (
            <Center mih="200px">
              <Stack align="center" gap="md">
                <Loader size="lg" />
                <Text c="dimmed">Loading booking data...</Text>
              </Stack>
            </Center>
          ) : error ? (
            <Center mih="200px">
              <Text c="red">Error loading booking data</Text>
            </Center>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }} spacing="md">
              <Paper withBorder radius="md" p="md" style={{ textAlign: 'center' }}>
                <ThemeIcon size="lg" variant="light" color="blue" mb="sm">
                  <IconCalendar size={24} />
                </ThemeIcon>
                <Text size="xl" fw={700}>{stats.total}</Text>
                <Text size="sm" c="dimmed">Total Bookings</Text>
              </Paper>

              <Paper withBorder radius="md" p="md" style={{ textAlign: 'center' }}>
                <ThemeIcon size="lg" variant="light" color="yellow" mb="sm">
                  <IconClock size={24} />
                </ThemeIcon>
                <Text size="xl" fw={700}>{stats.pending}</Text>
                <Text size="sm" c="dimmed">Pending</Text>
              </Paper>

              <Paper withBorder radius="md" p="md" style={{ textAlign: 'center' }}>
                <ThemeIcon size="lg" variant="light" color="blue" mb="sm">
                  <IconEye size={24} />
                </ThemeIcon>
                <Text size="xl" fw={700}>{stats.reviewed}</Text>
                <Text size="sm" c="dimmed">Reviewed</Text>
              </Paper>

              <Paper withBorder radius="md" p="md" style={{ textAlign: 'center' }}>
                <ThemeIcon size="lg" variant="light" color="green" mb="sm">
                  <IconCheck size={24} />
                </ThemeIcon>
                <Text size="xl" fw={700}>{stats.approved}</Text>
                <Text size="sm" c="dimmed">Approved</Text>
              </Paper>

              <Paper withBorder radius="md" p="md" style={{ textAlign: 'center' }}>
                <ThemeIcon size="lg" variant="light" color="red" mb="sm">
                  <IconX size={24} />
                </ThemeIcon>
                <Text size="xl" fw={700}>{stats.rejected}</Text>
                <Text size="sm" c="dimmed">Rejected</Text>
              </Paper>
            </SimpleGrid>
          )}
        </Paper>


      </Stack>
    </AdminLayout>
  );
}
