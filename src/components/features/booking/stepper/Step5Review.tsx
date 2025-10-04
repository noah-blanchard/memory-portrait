'use client';

import { useEffect, useState } from 'react';
import {
  IconCalendar,
  IconCamera,
  IconClock,
  IconCurrencyDollar,
  IconMapPin,
  IconUser,
  IconUsers,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Box,
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Transition,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { estimatePrice } from './helpers';
import type { BookingStepProps } from '@/types/components';

export interface Step5ReviewProps extends BookingStepProps {
  // Full navigation available in step 5 (review)
}

export default function Step5Review({
  form,
  onBack: _onBack,
  onNext: _onNext,
  loading: _loading = false,
}: Step5ReviewProps) {
  const { t } = useTranslation('common');
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mounted, setMounted] = useState(false);
  const values = form.values;

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (date: Date | null | string) => {
    if (!date) {
      return t('receipt_no_data');
    }
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return t('receipt_no_data');
    }
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    if (!time) {
      return t('receipt_no_data');
    }
    return time;
  };

  const getPhotoshootTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      portrait: t('photoshoot_portrait'),
      tourism: t('photoshoot_tourism'),
      family: t('photoshoot_family'),
      linkedin: t('photoshoot_linkedin'),
      event: t('photoshoot_event'),
    };
    return typeMap[type] || type;
  };

  const getLocationLabel = (location: string) => {
    return location === 'Montreal' ? t('step2_montreal') : t('step2_quebec_city');
  };

  const getSelectedEquipment = () => {
    const equipment = [];
    if (values.equipCanonIxus980is) {
      equipment.push(t('equipment_canon'));
    }
    if (values.equipHpCcd) {
      equipment.push(t('equipment_hp'));
    }
    if (values.equipIphoneX) {
      equipment.push(t('equipment_iphone_x'));
    }
    if (values.equipIphone13) {
      equipment.push(t('equipment_iphone_13'));
    }
    if (values.equipNikonDslr) {
      equipment.push(t('equipment_nikon'));
    }

    return equipment.length > 0 ? equipment : [t('receipt_none_selected')];
  };

  const getContactMethodLabel = (method: string) => {
    return method === 'wechat' ? t('step1_wechat') : t('step1_instagram');
  };

  return (
    <Transition mounted={mounted} transition="fade" duration={400}>
      {(styles) => (
        <Box style={styles}>
          <Stack gap={isMobile ? 'lg' : 'md'}>
            {/* Step Header */}
            <Box ta="center" mb="xs">
              <Text size={isMobile ? 'sm' : 'md'} fw={600} c="dimmed">
                {t('step4_review_title')}
              </Text>
              <Text size="xs" c="dimmed" mt={2}>
                {t('step4_review_subtitle')}
              </Text>
            </Box>

            {/* Review Card */}
            <Paper
              radius="xl"
              p={isMobile ? 'lg' : 'md'}
              withBorder
              style={{
                background: `linear-gradient(135deg, ${theme.colors.slate[0]} 0%, ${theme.colors.ocean[0]} 100%)`,
                border: `1px solid ${theme.colors.slate[2]}`,
                boxShadow: `0 8px 32px ${theme.colors.slate[2]}`,
              }}
            >
              <Stack gap={isMobile ? 'lg' : 'md'}>
                {/* Contact Information */}
                <Transition mounted transition="slide-up" duration={300}>
                  {(contactStyles) => (
                    <Box style={contactStyles}>
                      <Group gap="xs" mb="md">
                        <IconUser size={isMobile ? 20 : 16} color={theme.colors.ocean[6]} />
                        <Text fw={600} size={isMobile ? 'md' : 'sm'}>
                          {t('step4_review_contact')}
                        </Text>
                      </Group>
                      <Grid>
                        <Grid.Col span={isMobile ? 12 : 6}>
                          <Text size={isMobile ? 'sm' : 'xs'} c="dimmed" mb="xs">
                            {t('receipt_name')}
                          </Text>
                          <Text fw={500} size={isMobile ? 'md' : 'sm'}>
                            {values.clientName as string}
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={isMobile ? 12 : 6}>
                          <Text size={isMobile ? 'sm' : 'xs'} c="dimmed" mb="xs">
                            {t('receipt_contact')}
                          </Text>
                          <Group gap="xs">
                            <Badge size={isMobile ? 'sm' : 'xs'} variant="light" color="ocean">
                              {getContactMethodLabel(values.contactMethod as string)}
                            </Badge>
                            <Text fw={500} size={isMobile ? 'md' : 'sm'}>
                              {values.contact as string}
                            </Text>
                          </Group>
                        </Grid.Col>
                      </Grid>
                    </Box>
                  )}
                </Transition>

                <Divider />

                {/* Photoshoot Details */}
                <Transition mounted transition="slide-up" duration={300}>
                  {(detailsStyles) => (
                    <Box style={detailsStyles}>
                      <Group gap="xs" mb="md">
                        <IconCamera size={isMobile ? 20 : 16} color={theme.colors.emerald[6]} />
                        <Text fw={600} size={isMobile ? 'md' : 'sm'}>
                          {t('step4_review_details')}
                        </Text>
                      </Group>
                      <Grid>
                        <Grid.Col span={isMobile ? 12 : 6}>
                          <Text size={isMobile ? 'sm' : 'xs'} c="dimmed" mb="xs">
                            {t('receipt_type')}
                          </Text>
                          <Badge size={isMobile ? 'sm' : 'xs'} variant="light" color="emerald">
                            {getPhotoshootTypeLabel(values.photoshootKind as string)}
                          </Badge>
                        </Grid.Col>
                        <Grid.Col span={isMobile ? 12 : 6}>
                          <Text size={isMobile ? 'sm' : 'xs'} c="dimmed" mb="xs">
                            {t('receipt_location')}
                          </Text>
                          <Group gap="xs">
                            <IconMapPin size={isMobile ? 16 : 12} />
                            <Text fw={500} size={isMobile ? 'md' : 'sm'}>
                              {getLocationLabel(values.location as string)}
                            </Text>
                          </Group>
                        </Grid.Col>
                        <Grid.Col span={isMobile ? 12 : 6}>
                          <Text size={isMobile ? 'sm' : 'xs'} c="dimmed" mb="xs">
                            {t('receipt_people')}
                          </Text>
                          <Group gap="xs">
                            <IconUsers size={isMobile ? 16 : 12} />
                            <Text fw={500} size={isMobile ? 'md' : 'sm'}>
                              {values.peopleCount as number}
                            </Text>
                          </Group>
                        </Grid.Col>
                      </Grid>
                    </Box>
                  )}
                </Transition>

                <Divider />

                {/* Schedule */}
                <Transition mounted transition="slide-up" duration={300}>
                  {(scheduleStyles) => (
                    <Box style={scheduleStyles}>
                      <Group gap="xs" mb="md">
                        <IconCalendar size={isMobile ? 20 : 16} color={theme.colors.rose[6]} />
                        <Text fw={600} size={isMobile ? 'md' : 'sm'}>
                          {t('step4_review_schedule')}
                        </Text>
                      </Group>
                      <Grid>
                        <Grid.Col span={isMobile ? 12 : 6}>
                          <Text size={isMobile ? 'sm' : 'xs'} c="dimmed" mb="xs">
                            {t('receipt_date')}
                          </Text>
                          <Text fw={500} size={isMobile ? 'md' : 'sm'}>
                            {formatDate(values.date as Date | null)}
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={isMobile ? 12 : 6}>
                          <Text size={isMobile ? 'sm' : 'xs'} c="dimmed" mb="xs">
                            {t('receipt_start')}
                          </Text>
                          <Group gap="xs">
                            <IconClock size={isMobile ? 16 : 12} />
                            <Text fw={500} size={isMobile ? 'md' : 'sm'}>
                              {formatTime(values.time as string)}
                            </Text>
                          </Group>
                        </Grid.Col>
                        <Grid.Col span={isMobile ? 12 : 6}>
                          <Text size={isMobile ? 'sm' : 'xs'} c="dimmed" mb="xs">
                            {t('receipt_duration')}
                          </Text>
                          <Text fw={500} size={isMobile ? 'md' : 'sm'}>
                            {values.durationHours as number} {t('receipt_hours')}
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={isMobile ? 12 : 6}>
                          <Text size={isMobile ? 'sm' : 'xs'} c="dimmed" mb="xs">
                            {t('receipt_extra_edits')}
                          </Text>
                          <Text fw={500} size={isMobile ? 'md' : 'sm'}>
                            {(values.extraEdits as number) || 0}
                          </Text>
                        </Grid.Col>
                      </Grid>
                    </Box>
                  )}
                </Transition>

                <Divider />

                {/* Equipment */}
                <Transition mounted transition="slide-up" duration={300}>
                  {(equipmentStyles) => (
                    <Box style={equipmentStyles}>
                      <Group gap="xs" mb="md">
                        <IconCamera size={isMobile ? 20 : 16} color={theme.colors.ocean[6]} />
                        <Text fw={600} size={isMobile ? 'md' : 'sm'}>
                          {t('receipt_equipments')}
                        </Text>
                      </Group>
                      <Group gap="xs" wrap="wrap">
                        {getSelectedEquipment().map((equipment, index) => (
                          <Badge
                            key={index}
                            size={isMobile ? 'sm' : 'xs'}
                            variant="light"
                            color="ocean"
                          >
                            {equipment}
                          </Badge>
                        ))}
                        {(values.dslrAddonPhotos as number) > 0 && (
                          <Badge size={isMobile ? 'sm' : 'xs'} variant="light" color="rose">
                            {t('receipt_dslr_addon')}: {values.dslrAddonPhotos as number}{' '}
                            {t('receipt_photos')}
                          </Badge>
                        )}
                      </Group>
                    </Box>
                  )}
                </Transition>

                <Divider />

                {/* Pricing */}
                <Transition mounted transition="slide-up" duration={300}>
                  {(pricingStyles) => (
                    <Box style={pricingStyles}>
                      <Group gap="xs" mb="md">
                        <IconCurrencyDollar
                          size={isMobile ? 20 : 16}
                          color={theme.colors.emerald[6]}
                        />
                        <Text fw={600} size={isMobile ? 'md' : 'sm'}>
                          {t('receipt_pricing')}
                        </Text>
                        <Badge size="xs" variant="light" color="emerald">
                          {t('receipt_pricing_estimated')}
                        </Badge>
                      </Group>

                      <Paper
                        p="md"
                        radius="lg"
                        style={{
                          background: `linear-gradient(135deg, ${theme.colors.emerald[0]} 0%, ${theme.colors.ocean[0]} 100%)`,
                          border: `1px solid ${theme.colors.emerald[2]}`,
                        }}
                      >
                        <Stack gap={isMobile ? 'sm' : 'xs'}>
                          {(() => {
                            const equipment = {
                              equipCanonIxus980is: (values.equipCanonIxus980is as boolean) || false,
                              equipHpCcd: (values.equipHpCcd as boolean) || false,
                              equipIphoneX: (values.equipIphoneX as boolean) || false,
                              equipIphone13: (values.equipIphone13 as boolean) || false,
                              equipNikonDslr: (values.equipNikonDslr as boolean) || false,
                            };

                            const priceBreakdown = estimatePrice({
                              people: (values.peopleCount as number) || 1,
                              equipment,
                              durationHours: (values.durationHours as number) || 1,
                              addonPhotos: (values.dslrAddonPhotos as number) || 0,
                              location: (values.location as string) || 'Montreal',
                              transportationFee: (values.location as string) === 'Quebec City' ? 100 : 0,
                              extraEdits: (values.extraEdits as number) || 0,
                            });

                            return (
                              <>
                                <Group justify="space-between">
                                  <Text size={isMobile ? 'sm' : 'xs'} c="dimmed">
                                    {priceBreakdown.hours}h × ${priceBreakdown.baseHourly} (
                                    {priceBreakdown.package})
                                  </Text>
                                  <Text fw={500} size={isMobile ? 'md' : 'sm'}>
                                    ${priceBreakdown.base}
                                  </Text>
                                </Group>
                                {priceBreakdown.peopleSurcharge > 0 && (
                                  <Group justify="space-between">
                                    <Text size={isMobile ? 'sm' : 'xs'} c="dimmed">
                                      +{(values.peopleCount as number) - 1} {t('receipt_extra_people')}
                                    </Text>
                                    <Text fw={500} size={isMobile ? 'md' : 'sm'}>
                                      +${priceBreakdown.peopleSurcharge}
                                    </Text>
                                  </Group>
                                )}
                                {priceBreakdown.cityFee > 0 && (
                                  <Group justify="space-between">
                                    <Text size={isMobile ? 'sm' : 'xs'} c="dimmed">
                                      {t('receipt_qc_fee')}
                                    </Text>
                                    <Text fw={500} size={isMobile ? 'md' : 'sm'}>
                                      +${priceBreakdown.cityFee}
                                    </Text>
                                  </Group>
                                )}
                                {priceBreakdown.addonCost > 0 && (
                                  <Group justify="space-between">
                                    <Text size={isMobile ? 'sm' : 'xs'} c="dimmed">
                                      {priceBreakdown.addonPhotos} {t('receipt_photos')}
                                    </Text>
                                    <Text fw={500} size={isMobile ? 'md' : 'sm'}>
                                      +${priceBreakdown.addonCost}
                                    </Text>
                                  </Group>
                                )}
                                {priceBreakdown.extraEditsCost > 0 && (
                                  <Group justify="space-between">
                                    <Text size={isMobile ? 'sm' : 'xs'} c="dimmed">
                                      {priceBreakdown.extraEdits} {t('receipt_extra_edits_line')}
                                    </Text>
                                    <Text fw={500} size={isMobile ? 'md' : 'sm'}>
                                      +${priceBreakdown.extraEditsCost}
                                    </Text>
                                  </Group>
                                )}
                                {priceBreakdown.transportationFee > 0 && (
                                  <Group justify="space-between">
                                    <Text size={isMobile ? 'sm' : 'xs'} c="dimmed">
                                      {t('receipt_transport_fee')}
                                    </Text>
                                    <Text fw={500} size={isMobile ? 'md' : 'sm'}>
                                      +${priceBreakdown.transportationFee}
                                    </Text>
                                  </Group>
                                )}
                                <Divider />
                                <Group justify="space-between">
                                  <Text fw={600} size={isMobile ? 'md' : 'sm'}>
                                    {t('receipt_total')}
                                  </Text>
                                  <Text fw={700} size={isMobile ? 'lg' : 'md'} c="ocean">
                                    ${priceBreakdown.total}
                                  </Text>
                                </Group>
                              </>
                            );
                          })()}
                        </Stack>
                      </Paper>
                    </Box>
                  )}
                </Transition>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      )}
    </Transition>
  );
}
