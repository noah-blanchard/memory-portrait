'use client';

import {
  IconCalendar,
} from '@tabler/icons-react';
import {
  Stack,
  Center,
  Loader,
  Text,
  Paper,
  Accordion,
} from '@mantine/core';
import BookingStatusSection from './BookingStatusSection';

interface SearchResultsProps {
  data: any;
  isLoading: boolean;
  error: any;
}

export default function SearchResults({ data, isLoading, error }: SearchResultsProps) {
  if (isLoading) {
    return (
      <Center mih="200px">
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Searching bookings...</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Paper withBorder radius="md" p="lg" style={{ borderColor: 'var(--mantine-color-red-3)' }}>
        <Text c="red" fw={600}>Error Loading Bookings</Text>
        <Text size="sm" c="dimmed" mt="xs">{error.message}</Text>
      </Paper>
    );
  }

  if (data) {
    return (
      <Accordion multiple defaultValue={['pending', 'reviewed', 'approved', 'rejected']}>
        {Object.entries(data).map(([status, bookings]) => (
          <BookingStatusSection
            key={status}
            status={status}
            bookings={bookings as any[]}
          />
        ))}
      </Accordion>
    );
  }

  return (
    <Center mih="200px">
      <Stack align="center" gap="md">
        <IconCalendar size={48} color="var(--mantine-color-gray-4)" />
        <Text size="lg" c="dimmed">No bookings found</Text>
        <Text size="sm" c="dimmed">Try adjusting your search criteria</Text>
      </Stack>
    </Center>
  );
}
