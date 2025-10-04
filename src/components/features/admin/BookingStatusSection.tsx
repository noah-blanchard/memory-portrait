'use client';

import {
  IconClock,
  IconCheck,
  IconEye,
  IconX,
} from '@tabler/icons-react';
import {
  Badge,
  SimpleGrid,
  Accordion,
} from '@mantine/core';
import BookingCard from './BookingCard';
import type { BookingGrouped } from '@/schemas/booking/bookingGrouped';

type BookingRow = BookingGrouped['pending'][0];

interface BookingStatusSectionProps {
  status: string;
  bookings: BookingRow[];
}

const statusConfig = {
  pending: { color: 'yellow', label: 'Pending', icon: IconClock },
  reviewed: { color: 'blue', label: 'Reviewed', icon: IconEye },
  approved: { color: 'green', label: 'Approved', icon: IconCheck },
  rejected: { color: 'red', label: 'Rejected', icon: IconX },
};

export default function BookingStatusSection({ status, bookings }: BookingStatusSectionProps) {
  if (!bookings || bookings.length === 0) { return null; }
  
  const config = statusConfig[status as keyof typeof statusConfig];
  const StatusIcon = config.icon;

  return (
    <Accordion.Item key={status} value={status}>
      <Accordion.Control>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StatusIcon size={20} color={`var(--mantine-color-${config.color}-6)`} />
          <span style={{ fontWeight: 600 }}>{config.label}</span>
          <Badge color={config.color} variant="light" size="lg">
            {bookings.length}
          </Badge>
        </div>
      </Accordion.Control>
      
      <Accordion.Panel>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {bookings.map((booking) => (
            <BookingCard key={booking.request_uid} booking={booking} />
          ))}
        </SimpleGrid>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
