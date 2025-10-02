'use client';

import { useEffect, useState } from 'react';
import { Center, Loader, Stack } from '@mantine/core';
import { Alert, Button, Title } from '@/components/I18nUI/I18nUI';
import type { BookingGrouped } from '@/schemas/bookingGrouped';
import type { BookingStatus } from './statusTheme';
import BookingsGroupedView from './ui/BookingsGroupedView';

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
        throw new Error(json?.error?.message ?? 'admin_failed_fetch');
      }
      setData(json.data as BookingGrouped);
    } catch (e: any) {
      setErr(e?.message ?? 'admin_unknown_error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (
    requestUid: string,
    from: BookingStatus,
    to: BookingStatus
  ): Promise<void> => {
    if (!data || from === to) {
      return;
    }

    const snapshot = data;

    const moved = snapshot[from].find((r) => r.request_uid === requestUid);
    if (!moved) {
      return;
    }

    setData((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        [from]: prev[from].filter((r) => r.request_uid !== requestUid),
        [to]: [{ ...moved, status: to }, ...prev[to]],
      };
    });

    const res = await fetch('/api/bookings/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ requestUid, status: to }),
    });
    const json = await res.json();

    if (!res.ok || !json?.ok) {
      setData(snapshot);
      throw new Error(json?.error?.message ?? 'admin_failed_update');
    }
  };

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
        <Alert color="red" variant="light" title="admin_error_loading">
          {err}
        </Alert>
        <Button onClick={load} variant="light">
          common_retry
        </Button>
      </Stack>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Stack>
      <Title size={20}>admin_bookings_title</Title>
      <BookingsGroupedView data={data} onChangeStatus={changeStatus} />
    </Stack>
  );
}
