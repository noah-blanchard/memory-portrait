'use client';

import { useEffect, useState } from 'react';
import { Alert, Button, Center, Loader, Stack, Group, Title } from '@mantine/core';
import BookingsGroupedView from './ui/BookingsGroupedView';
import type { BookingGrouped } from '@/schemas/bookingGrouped';

export default function BookingsPanel() {
  const [data, setData] = useState<BookingGrouped | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch('/api/bookings', { credentials: 'include' });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error?.message ?? 'Failed to fetch bookings');
      }
      setData(json.data as BookingGrouped);
    } catch (e: any) {
      setErr(e?.message ?? 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <Center mih="40dvh">
        <Loader />
      </Center>
    );
  }

  if (err) {
    return (
      <Stack>
        <Alert color="red" variant="light" title="Error loading bookings">
          {err}
        </Alert>
        <Group justify="center">
          <Button onClick={load}>Retry</Button>
        </Group>
      </Stack>
    );
  }

  if (!data) return null;

  return (
    <Stack>
      {/* <Group justify="end">
        <Button variant="light" onClick={load}>Refresh</Button>
      </Group> */}
      <Title size={20}>
        Bookings Overview
      </Title>
      <BookingsGroupedView data={data} />
    </Stack>
  );
}
