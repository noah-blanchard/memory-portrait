'use client';

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Roboto_Mono } from 'next/font/google';
import { IconCheck, IconCopy, IconDownload } from '@tabler/icons-react';
import html2canvas from 'html2canvas';
import {
  Box,
  Button,
  Collapse,
  CopyButton,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip,
  Transition,
} from '@mantine/core';

const receiptFont = Roboto_Mono({ subsets: ['latin'], weight: '400' });

export type ReceiptData = {
  id?: string | null;
  createdAt?: string | null;
  name: string;
  method: string;
  contact: string;
  kind: string;
  date: string;
  start: string;
  end: string;
  durationHours: number;
  location?: string | null;
};

export default function ReceiptCard({
  data,
  onNew,
}: {
  data: ReceiptData | null;
  onNew: () => void;
}) {
  const mounted = !!data;
  const [opened, setOpened] = useState(false);

  // Ouvre le "déroulé" juste après le mount (joli effet)
  useEffect(() => {
    if (mounted) {
      const t = setTimeout(() => setOpened(true), 40);
      return () => clearTimeout(t);
    }
    setOpened(false);
  }, [mounted]);

  if (!mounted) {
    return (
      <Stack align="center" gap="sm">
        <Text c="dimmed">No receipt data</Text>
        <Button variant="light" onClick={onNew}>
          New request
        </Button>
      </Stack>
    );
  }

  const line = <Box my="xs" style={{ borderTop: '1px dashed var(--mantine-color-gray-4)' }} />;

  async function downloadReceipt(id: string | null | undefined): Promise<void> {
    if (!id) return;
    const receiptEl = document.querySelector('.' + receiptFont.className);
    if (!receiptEl) return;

    const canvas = await html2canvas(receiptEl as HTMLElement, {
      backgroundColor: '#fff',
      scale: 2,
    });
    const imgData = canvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = imgData;
    a.download = `receipt-${short(id)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <Stack align="center" gap="md" w="100%" h="100%">
      <Transition
        mounted={mounted}
        transition="slide-up"
        duration={400}
        timingFunction="cubic-bezier(.2,.8,.2,1)"
      >
        {(styles) => (
          <div style={{ ...styles, width: '100%' }}>
            <Paper
              shadow="lg"
              withBorder
              radius="md"
              p="lg"
              className={receiptFont.className}
              maw={420} // largeur max du reçu
              w="100%" // prend la largeur dispo jusqu’à 420px
              mx="auto" // ⬅️ centre horizontalement
              style={{
                borderStyle: 'dashed',
                overflow: 'hidden',
              }}
            >
              <Collapse in={opened} transitionDuration={500}>
                <Group justify="space-between" mb="xs">
                  <Text fw={900} tt="uppercase" fz="lg">
                    Receipt
                  </Text>

                  {data?.id ? (
                    <Group gap="xs">
                      <CopyButton value={data.id}>
                        {({ copied, copy }) => (
                          <Tooltip label={copied ? 'Copied' : 'Copy ID'} withArrow>
                            <Button
                              variant="subtle"
                              size="compact-xs"
                              leftSection={
                                copied ? <IconCheck size={16} /> : <IconCopy size={16} />
                              }
                              onClick={copy}
                            >
                              #{short(data.id ?? '')}
                            </Button>
                          </Tooltip>
                        )}
                      </CopyButton>

                      <Button
                        variant="subtle"
                        size="compact-xs"
                        onClick={() => downloadReceipt(data.id)}
                      >
                        <IconDownload size={16} />
                      </Button>
                    </Group>
                  ) : (
                    <Text c="dimmed" fz="sm">
                      (no id)
                    </Text>
                  )}
                </Group>

                {line}

                <Row label="Name" value={data.name} />
                <Row label="Contact" value={`${cap(data.method)} • ${data.contact}`} />
                <Row label="Type" value={cap(data.kind)} />
                {data.location ? <Row label="Location" value={String(data.location)} /> : null}

                {line}

                <Row label="Date" value={data.date} />
                <Row label="Start" value={data.start} />
                <Row label="End" value={data.end} />
                <Row label="Duration" value={`${data.durationHours}h`} />

                {line}

                <Group justify="space-between" mt="sm">
                  <Text fz="sm" c="dimmed" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {data.createdAt
                      ? dayjs(data.createdAt).format('YYYY-MM-DD HH:mm')
                      : dayjs().format('YYYY-MM-DD HH:mm')}
                  </Text>
                  <Text fz="sm">Thank you ✨</Text>
                </Group>
              </Collapse>
            </Paper>
          </div>
        )}
      </Transition>

      {/* <Group>
        <Button variant="light" onClick={onNew}>
          New request
        </Button>
      </Group> */}
    </Stack>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Group justify="space-between" gap="xs">
      <Text fz="md">{label}</Text>
      <Text fz="md" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Text>
    </Group>
  );
}

function short(id: string) {
  return id.slice(0, 6).toUpperCase();
}
function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
