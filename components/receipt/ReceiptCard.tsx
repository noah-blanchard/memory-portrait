'use client';

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Roboto_Mono } from 'next/font/google';
import { IconCheck, IconCopy, IconDownload } from '@tabler/icons-react';
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';
import { Box, Collapse, CopyButton, Group, Paper, Stack, Transition } from '@mantine/core';
import { Button, Text, Tooltip } from '@/components/I18nUI/I18nUI';
import { estimatePrice, RATES } from '../booking/stepper/helpers';

const receiptFont = Roboto_Mono({ subsets: ['latin'], weight: '400' });

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

export interface ReceiptCardProps {
  data: ReceiptData | null;
  onNew: () => void;
}

export default function ReceiptCard({
  data,
  onNew,
}: ReceiptCardProps) {
  const { t } = useTranslation('common');
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
        <Text c="dimmed">receipt_no_data</Text>
        <Button variant="light" size="xs" onClick={onNew}>
          receipt_new_request
        </Button>
      </Stack>
    );
  }

  const line = <Box my={7} style={{ borderTop: '1px dashed var(--mantine-color-gray-4)' }} />;

  async function downloadReceipt(id: string | null | undefined) {
    if (!id) {
      return;
    }
    const receiptEl = document.querySelector(`.${receiptFont.className}`);
    if (!receiptEl) {
      return;
    }
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
                    {t('receipt_title')}
                  </Text>

                  {data?.id ? (
                    <Group gap={4} wrap="nowrap">
                      <CopyButton value={data.id}>
                        {({ copied, copy }) => (
                          <Tooltip
                            label={copied ? t('receipt_copied') : t('receipt_copy_id')}
                            withArrow
                          >
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
                        aria-label={t('receipt_download')}
                      >
                        <IconDownload size={14} />
                      </Button>
                    </Group>
                  ) : (
                    <Text c="dimmed">{t('receipt_no_id')}</Text>
                  )}
                </Group>

                {line}

                <Row label={t('receipt_name')} value={data.name} />
                <Row label={t('receipt_contact')} value={`${cap(data.method)} • ${data.contact}`} />
                <Row label={t('receipt_type')} value={cap(data.kind)} />
                {data.location ? (
                  <Row label={t('receipt_location')} value={String(data.location)} />
                ) : null}

                {line}

                <Row label={t('receipt_date')} value={data.date} />
                <Row label={t('receipt_start')} value={data.start} />
                <Row label={t('receipt_end')} value={data.end} />
                <Row label={t('receipt_duration')} value={`${pricing.hours}h`} />
                <Row label={t('receipt_people')} value={String(data.peopleCount ?? 1)} />
                {line}

                <Row label={t('receipt_package')} value={cap(pricing.package.replace('_', ' '))} />
                <Row label={t('receipt_included_edits')} value={`${pricing.includedEdits}`} />
                {data?.extraEdits !== 0 && (
                  <Row label={t('receipt_extra_edits')} value={`${data.extraEdits}`} />
                )}
                {line}

                <Text size="sm" fw={900} tt="uppercase" mt={4}>
                  {t('receipt_equipments')}
                </Text>

                {!anyEquip ? (
                  <Text size="xs" c="dimmed">
                    {t('receipt_none_selected')}
                  </Text>
                ) : (
                  <Stack gap={6}>
                    {hasCCD && (
                      <Stack gap={2}>
                        <Text size="xs" c="dimmed">
                          {includesCcdPhone ? t('receipt_ccd_included') : t('receipt_ccd_cameras')}
                        </Text>
                        {data.equipCanonIxus980is && (
                          <EquipLine label={t('receipt_canon_ixus980is')} />
                        )}
                        {data.equipHpCcd && <EquipLine label={t('receipt_hp_ccd')} />}
                      </Stack>
                    )}
                    {hasPhones && (
                      <Stack gap={2}>
                        <Text size="xs" c="dimmed">
                          {includesCcdPhone ? t('receipt_phones_included') : t('receipt_phones')}
                        </Text>
                        {data.equipIphoneX && <EquipLine label={t('receipt_iphone_x')} />}
                        {data.equipIphone13 && <EquipLine label={t('receipt_iphone_13')} />}
                      </Stack>
                    )}
                    {hasDSLR && (
                      <Stack gap={2}>
                        <Text size="xs" c="dimmed">
                          {t('receipt_dslr')}
                        </Text>
                        {data.equipNikonDslr && <EquipLine label={t('receipt_nikon_dslr')} />}
                      </Stack>
                    )}
                  </Stack>
                )}

                {line}

                <Text size="sm" fw={900} tt="uppercase" mt={4}>
                  {t('receipt_pricing_estimated')}
                </Text>

                <RowCurrency
                  label={`${pricing.hours} ${t('receipt_hours')}`}
                  amount={pricing.base}
                />

                {pricing.peopleSurcharge > 0 && (
                  <RowCurrency
                    label={
                      extraPersons > 0
                        ? t('receipt_extra_people_hourly', {
                            count: extraPersons,
                            price: pricing.peopleSurchargeHourly,
                          })
                        : t('receipt_extra_people')
                    }
                    amount={pricing.peopleSurcharge}
                  />
                )}

                {pricing.cityFee > 0 && (
                  <RowCurrency label={t('receipt_qc_fee')} amount={pricing.cityFee} />
                )}

                {pricing.transportationFee > 0 && (
                  <RowCurrency
                    label={t('receipt_transport_fee')}
                    amount={pricing.transportationFee}
                  />
                )}

                {pricing.addonPhotos > 0 && (
                  <RowCurrency
                    label={`${t('receipt_dslr_addon')} (${pricing.addonPhotos} ${pricing.addonPhotos > 1 ? t('receipt_photos_plural') : t('receipt_photos')})`}
                    amount={pricing.addonCost}
                  />
                )}

                {pricing.extraEditsCost > 0 && (
                  <RowCurrency
                    label={t('receipt_extra_edits_line', {
                      count: pricing.extraEdits,
                      price: RATES.EDIT_EXTRA_PRICE,
                    })}
                    amount={pricing.extraEditsCost}
                  />
                )}

                {durationMinEnforced && (
                  <Text size="xs" c="dimmed">
                    {t('receipt_minimum_duration_note')}
                  </Text>
                )}

                {line}

                <RowCurrency label={t('receipt_total')} amount={pricing.total} strong />

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
                  <Text size="xs">{t('receipt_thank_you')}</Text>
                </Group>
              </Collapse>
            </Paper>
          </div>
        )}
      </Transition>
    </Stack>
  );
}

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
      <Text size="xs" c={dimmed ? 'dimmed' : undefined}>
        {label}
      </Text>
      <Text
        size="xs"
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

function short(id: string) {
  return id.slice(0, 6).toUpperCase();
}
function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function formatUsd(n: number) {
  return `$${n.toFixed(2).replace(/\.00$/, '')}`;
}
