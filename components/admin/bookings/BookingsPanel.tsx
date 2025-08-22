'use client';

import { useEffect, useState } from 'react';
import { Alert, Button, Center, Loader, Stack, Title } from '@mantine/core';
import BookingsGroupedView from './ui/BookingsGroupedView';
import type { BookingGrouped } from '@/schemas/bookingGrouped';
import type { BookingStatus } from './statusTheme';

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
      if (!res.ok || !json?.ok) throw new Error(json?.error?.message ?? 'Failed to fetch bookings');
      setData(json.data as BookingGrouped);
    } catch (e: any) {
      setErr(e?.message ?? 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // 🔀 Changement de statut avec update optimiste + rollback si erreur
  const changeStatus = async (
    requestUid: string,
    from: BookingStatus,
    to: BookingStatus
  ): Promise<void> => {
    if (!data || from === to) return;

    // garde une copie pour rollback si besoin
    const snapshot = data;

    // trouve la ligne à déplacer
    const moved = snapshot[from].find((r) => r.request_uid === requestUid);
    if (!moved) return;

    // optimiste: retire de l'ancien groupe et ajoute au nouveau
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [from]: prev[from].filter((r) => r.request_uid !== requestUid),
        [to]: [{ ...moved, status: to }, ...prev[to]],
      };
    });

    // PATCH API
    const res = await fetch('/api/bookings/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ requestUid, status: to }),
    });
    const json = await res.json();

    if (!res.ok || !json?.ok) {
      // rollback
      setData(snapshot);
      throw new Error(json?.error?.message ?? 'Failed to update status');
    }
  };

  if (loading) return (<Center mih="40dvh"><Loader /></Center>);

  if (err) {
    return (
      <Stack>
        <Alert color="red" variant="light" title="Error loading bookings">{err}</Alert>
        <Button onClick={load} variant="light">Retry</Button>
      </Stack>
    );
  }

  if (!data) return null;

  return (
    <Stack>
      <Title size={20}>Bookings Overview</Title>
      <BookingsGroupedView data={data} onChangeStatus={changeStatus} />
    </Stack>
  );
}
