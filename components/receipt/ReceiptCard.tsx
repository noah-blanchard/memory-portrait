'use client';

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Roboto_Mono } from 'next/font/google';
import { IconCheck, IconCopy, IconDownload } from '@tabler/icons-react';
import html2canvas from 'html2canvas';
import { Box, Button, Collapse, CopyButton, Group, Paper, Stack, Text, Tooltip, Transition } from '@mantine/core';
import { estimatePrice, RATES } from '../booking/stepper/helpers';


const receiptFont = Roboto_Mono({ subsets: ['latin'], weight: '400' });

// ——— compact sizing
const BASE_FONT_SIZE_PX = 12;
const BASE_LINE_HEIGHT = 1.15;

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
  location: 'Montreal' | 'Quebec City';
  peopleCount?: number;
  dslrAddonPhotos?: number | null;
  equipCanonIxus980is?: boolean;
  equipHpCcd?: boolean;
  equipIphoneX?: boolean;
  equipIphone13?: boolean;
  equipNikonDslr?: boolean;
  extraEdits?: number;
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

  useEffect(() => {
    if (mounted) {
      const t = setTimeout(() => setOpened(true), 40);
      return () => clearTimeout(t);
    }
    setOpened(false);
  }, [mounted]);

  if (!mounted) {
    return (
      <Stack align="center" gap="xs">
        <Text c="dimmed">No receipt data</Text>
        <Button variant="light" size="xs" onClick={onNew}>
          New request
        </Button>
      </Stack>
    );
  }

  const line = <Box my={7} style={{ borderTop: '1px dashed var(--mantine-color-gray-4)' }} />;

  async function downloadReceipt(id: string | null | undefined) {
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

  const hasCCD = !!data.equipCanonIxus980is || !!data.equipHpCcd;
  const hasPhones = !!data.equipIphoneX || !!data.equipIphone13;
  const hasDSLR = !!data.equipNikonDslr;
  const anyEquip = hasCCD || hasPhones || hasDSLR;

  const pricing = estimatePrice({
    location: data.location ?? 'Montreal',
    people: data.peopleCount ?? 1,
    durationHours: data.durationHours,
    addonPhotos: data.dslrAddonPhotos ?? 0,
    extraEdits: data.extraEdits ?? 0,
    equipment: {
      equipCanonIxus980is: !!data.equipCanonIxus980is,
      equipHpCcd: !!data.equipHpCcd,
      equipIphoneX: !!data.equipIphoneX,
      equipIphone13: !!data.equipIphone13,
      equipNikonDslr: !!data.equipNikonDslr,
    },
  });

  // Infos additionnelles pour l’affichage
  const extraPersons = Math.max(0, (data.peopleCount ?? 1) - 1);
  const includesCcdPhone = hasDSLR && pricing.package === 'DSLR' && pricing.hours >= 2;
  const durationMinEnforced = pricing.hours !== Math.ceil(Math.max(1, data.durationHours || 1));

  return (
    <Stack align="center" gap="sm" w="100%" h="100%">
      <Transition
        mounted={mounted}
        transition="slide-up"
        duration={350}
        timingFunction="cubic-bezier(.2,.8,.2,1)"
      >
        {(styles) => (
          <div style={{ ...styles, width: '100%' }}>
            <Paper
              shadow="sm"
              withBorder
              radius="md"
              p="md"
              className={receiptFont.className}
              maw={420}
              w="100%"
              mx="auto"
              style={{
                borderStyle: 'dashed',
                overflow: 'hidden',
                fontSize: BASE_FONT_SIZE_PX,
                lineHeight: BASE_LINE_HEIGHT,
              }}
            >
              <Collapse in={opened} transitionDuration={400}>
                <Group justify="space-between" mb={6} gap="xs" wrap="nowrap">
                  <Text fw={900} tt="uppercase">
                    Receipt
                  </Text>

                  {data?.id ? (
                    <Group gap={4} wrap="nowrap">
                      <CopyButton value={data.id}>
                        {({ copied, copy }) => (
                          <Tooltip label={copied ? 'Copied' : 'Copy ID'} withArrow>
                            <Button
                              variant="subtle"
                              size="compact-xs"
                              leftSection={
                                copied ? <IconCheck size={14} /> : <IconCopy size={14} />
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
                        aria-label="Download receipt"
                      >
                        <IconDownload size={14} />
                      </Button>
                    </Group>
                  ) : (
                    <Text c="dimmed">(no id)</Text>
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
                <Row label="Duration" value={`${pricing.hours}h`} />
                <Row label="People" value={String(data.peopleCount ?? 1)} />
                {line}

                {/* Type de package */}
                <Row label="Package" value={cap(pricing.package.replace('_', ' '))} />
                <Row label="Included edits" value={`${pricing.includedEdits}`} />
                {data?.extraEdits && <Row label="Extra edits" value={`${data.extraEdits}`} />}
                {line}

                <Text size="sm" fw={900} tt="uppercase" mt={4}>
                  Equipment(s)
                </Text>

                {!anyEquip ? (
                  <Text size="xs" c="dimmed">
                    (none selected)
                  </Text>
                ) : (
                  <Stack gap={6}>
                    {hasCCD && (
                      <Stack gap={2}>
                        <Text size="xs" c="dimmed">
                          CCD Cameras{includesCcdPhone ? ' (included)' : ''}
                        </Text>
                        {data.equipCanonIxus980is && <EquipLine label="Canon ixus980is (CCD)" />}
                        {data.equipHpCcd && <EquipLine label="HP (CCD)" />}
                      </Stack>
                    )}
                    {hasPhones && (
                      <Stack gap={2}>
                        <Text size="xs" c="dimmed">
                          Phones{includesCcdPhone ? ' (included)' : ''}
                        </Text>
                        {data.equipIphoneX && <EquipLine label="iPhone X" />}
                        {data.equipIphone13 && <EquipLine label="iPhone 13" />}
                      </Stack>
                    )}
                    {hasDSLR && (
                      <Stack gap={2}>
                        <Text size="xs" c="dimmed">
                          DSLR
                        </Text>
                        {data.equipNikonDslr && <EquipLine label="Nikon (DSLR)" />}
                      </Stack>
                    )}
                  </Stack>
                )}

                {line}

                <Text size="sm" fw={900} tt="uppercase" mt={4}>
                  Pricing (estimated)
                </Text>

                {/* Heures (utiliser pricing.hours pour refléter min QC) */}
                <RowCurrency label={`${pricing.hours} hours`} amount={pricing.base} />

                {/* Surcharge personnes */}
                {pricing.peopleSurcharge > 0 && (
                  <RowCurrency
                    label={
                      extraPersons > 0
                        ? `Extra ppl. (${extraPersons}×$${pricing.peopleSurchargeHourly}/h)`
                        : 'Extra ppl.'
                    }
                    amount={pricing.peopleSurcharge}
                  />
                )}

                {/* Frais Québec City */}
                {pricing.cityFee > 0 && (
                  <RowCurrency label="Quebec City fee" amount={pricing.cityFee} />
                )}

                {/* Transportation fee */}
                {pricing.transportationFee > 0 && (
                  <RowCurrency label="Transportation fee" amount={pricing.transportationFee} />
                )}

                {/* Add-on DSLR (si applicable) */}
                {pricing.addonPhotos > 0 && (
                  <RowCurrency
                    label={`DSLR add-on (${pricing.addonPhotos} photo${
                      pricing.addonPhotos > 1 ? 's' : ''
                    })`}
                    amount={pricing.addonCost}
                  />
                )}

                {/* Edits inclus + extras */}
                {pricing.extraEditsCost > 0 && (
                  <RowCurrency
                    label={`Extra edits (${pricing.extraEdits} × $${RATES.EDIT_EXTRA_PRICE})`}
                    amount={pricing.extraEditsCost}
                  />
                )}

                {/* Note si une durée minimale a été imposée (ex.: QC + DSLR min 4h) */}
                {durationMinEnforced && (
                  <Text size="xs" c="dimmed">
                    • Minimum duration enforced by location/package rules
                  </Text>
                )}

                {line}

                <RowCurrency label="Total" amount={pricing.total} strong />

                {pricing.warnings.length > 0 && (
                  <Stack gap={2} mt={2}>
                    {pricing.warnings.map((w, i) => (
                      <Text key={i} c="orange.7">
                        • {w}
                      </Text>
                    ))}
                  </Stack>
                )}

                {line}

                <Group justify="space-between" mt={6}>
                  <Text c="dimmed" size="xs" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {data.createdAt
                      ? dayjs(data.createdAt).format('YYYY-MM-DD HH:mm')
                      : dayjs().format('YYYY-MM-DD HH:mm')}
                  </Text>
                  <Text size="xs">Thank you ✨</Text>
                </Group>
              </Collapse>
            </Paper>
          </div>
        )}
      </Transition>
    </Stack>
  );
}

/* ---------- UI helpers ---------- */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <Group justify="space-between" gap={6}>
      <Text size="xs">{label}</Text>
      <Text size="xs" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Text>
    </Group>
  );
}

function RowCurrency({
  label,
  amount,
  strong,
  dimmed,
}: {
  label: string;
  amount: number;
  strong?: boolean;
  dimmed?: boolean;
}) {
  return (
    <Group justify="space-between" gap={6}>
      <Text size={'xs'} c={dimmed ? 'dimmed' : undefined}>
        {label}
      </Text>
      <Text
        size={'xs'}
        c={dimmed ? 'dimmed' : undefined}
        fw={strong ? 800 : 500}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {formatUsd(amount)}
      </Text>
    </Group>
  );
}

function EquipLine({ label }: { label: string }) {
  return (
    <Text size="xs" style={{ lineHeight: BASE_LINE_HEIGHT }}>
      • {label}
    </Text>
  );
}

/* ---------- utils ---------- */
function short(id: string) {
  return id.slice(0, 6).toUpperCase();
}
function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function formatUsd(n: number) {
  return `$${n.toFixed(2).replace(/\.00$/, '')}`;
}