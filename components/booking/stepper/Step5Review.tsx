'use client';

import { useTranslation } from 'react-i18next';
import { 
  Stack, 
  Group, 
  Text, 
  Title, 
  Card, 
  Badge, 
  Divider,
  Button,
  Box,
  Grid,
} from '@mantine/core';
import { 
  IconUser, 
  IconCalendar, 
  IconClock, 
  IconMapPin, 
  IconCamera, 
  IconUsers,
  IconEdit,
  IconCheck,
} from '@tabler/icons-react';
import type { UseFormReturnType } from '@mantine/form';
import { estimatePrice } from './helpers';

interface Step5ReviewProps {
  form: UseFormReturnType<any>;
  onBack: () => void;
  onNext: () => void;
  loading: boolean;
}

export default function Step5Review({ form, onBack, onNext, loading }: Step5ReviewProps) {
  const { t } = useTranslation('common');
  const values = form.values;

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
      day: 'numeric' 
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
    <Stack gap="md">
      <Box ta="center">
        <Title order={4} mb="xs">{t('step4_review_title')}</Title>
        <Text c="dimmed" size="xs">{t('step4_review_subtitle')}</Text>
      </Box>

      <Card withBorder radius="md" p="md">
        <Stack gap="sm">
          <Box>
            <Group gap="xs" mb="xs">
              <IconUser size={16} />
              <Text fw={600} size="sm">{t('step4_review_contact')}</Text>
            </Group>
            <Grid>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">{t('receipt_name')}</Text>
                <Text fw={500} size="sm">{values.clientName}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">{t('receipt_contact')}</Text>
                <Group gap="xs">
                  <Badge size="xs" variant="light" color="ocean">
                    {getContactMethodLabel(values.contactMethod)}
                  </Badge>
                  <Text fw={500} size="sm">{values.contact}</Text>
                </Group>
              </Grid.Col>
            </Grid>
          </Box>

          <Divider />

          <Box>
            <Group gap="xs" mb="xs">
              <IconCamera size={16} />
              <Text fw={600} size="sm">{t('step4_review_details')}</Text>
            </Group>
            <Grid>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">{t('receipt_type')}</Text>
                <Badge size="xs" variant="light" color="emerald">
                  {getPhotoshootTypeLabel(values.photoshootKind)}
                </Badge>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">{t('receipt_location')}</Text>
                <Group gap="xs">
                  <IconMapPin size={12} />
                  <Text fw={500} size="sm">{getLocationLabel(values.location)}</Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">{t('receipt_people')}</Text>
                <Group gap="xs">
                  <IconUsers size={12} />
                  <Text fw={500} size="sm">{values.peopleCount}</Text>
                </Group>
              </Grid.Col>
            </Grid>
          </Box>

          <Divider />

          <Box>
            <Group gap="xs" mb="xs">
              <IconCalendar size={16} />
              <Text fw={600} size="sm">{t('step4_review_schedule')}</Text>
            </Group>
            <Grid>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">{t('receipt_date')}</Text>
                <Text fw={500} size="sm">{formatDate(values.date)}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">{t('receipt_start')}</Text>
                <Group gap="xs">
                  <IconClock size={12} />
                  <Text fw={500} size="sm">{formatTime(values.time)}</Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">{t('receipt_duration')}</Text>
                <Text fw={500} size="sm">{values.durationHours} {t('receipt_hours')}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">{t('receipt_extra_edits')}</Text>
                <Text fw={500} size="sm">{values.extraEdits}</Text>
              </Grid.Col>
            </Grid>
          </Box>

          <Divider />

          <Box>
            <Group gap="xs" mb="xs">
              <IconCamera size={16} />
              <Text fw={600} size="sm">{t('receipt_equipments')}</Text>
            </Group>
            <Group gap="xs" wrap="wrap">
              {getSelectedEquipment().map((equipment, index) => (
                <Badge key={index} size="xs" variant="light" color="ocean">
                  {equipment}
                </Badge>
              ))}
              {values.dslrAddonPhotos > 0 && (
                <Badge size="xs" variant="light" color="rose">
                  {t('receipt_dslr_addon')}: {values.dslrAddonPhotos} {t('receipt_photos')}
                </Badge>
              )}
            </Group>
          </Box>

          <Divider />

          <Box>
            <Text fw={600} size="xs" mb="xs" c="dimmed">{t('receipt_pricing')}</Text>
            <Stack gap={4}>
              {(() => {
                const equipment = {
                  equipCanonIxus980is: values.equipCanonIxus980is || false,
                  equipHpCcd: values.equipHpCcd || false,
                  equipIphoneX: values.equipIphoneX || false,
                  equipIphone13: values.equipIphone13 || false,
                  equipNikonDslr: values.equipNikonDslr || false,
                };

                const priceBreakdown = estimatePrice({
                  people: values.peopleCount || 1,
                  equipment,
                  durationHours: values.durationHours || 1,
                  addonPhotos: values.dslrAddonPhotos || 0,
                  location: values.location || 'Montreal',
                  transportationFee: values.location === 'Quebec City' ? 100 : 0,
                  extraEdits: values.extraEdits || 0,
                });

                return (
                  <>
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">{priceBreakdown.hours}h × ${priceBreakdown.baseHourly} ({priceBreakdown.package})</Text>
                      <Text fw={500} size="xs">${priceBreakdown.base}</Text>
                    </Group>
                    {priceBreakdown.peopleSurcharge > 0 && (
                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">+{values.peopleCount - 1} {t('receipt_extra_people')}</Text>
                        <Text fw={500} size="xs">+${priceBreakdown.peopleSurcharge}</Text>
                      </Group>
                    )}
                    {priceBreakdown.cityFee > 0 && (
                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">{t('receipt_qc_fee')}</Text>
                        <Text fw={500} size="xs">+${priceBreakdown.cityFee}</Text>
                      </Group>
                    )}
                    {priceBreakdown.addonCost > 0 && (
                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">{priceBreakdown.addonPhotos} {t('receipt_photos')}</Text>
                        <Text fw={500} size="xs">+${priceBreakdown.addonCost}</Text>
                      </Group>
                    )}
                    {priceBreakdown.extraEditsCost > 0 && (
                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">{priceBreakdown.extraEdits} {t('receipt_extra_edits_line')}</Text>
                        <Text fw={500} size="xs">+${priceBreakdown.extraEditsCost}</Text>
                      </Group>
                    )}
                    {priceBreakdown.transportationFee > 0 && (
                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">{t('receipt_transport_fee')}</Text>
                        <Text fw={500} size="xs">+${priceBreakdown.transportationFee}</Text>
                      </Group>
                    )}
                    <Divider />
                    <Group justify="space-between">
                      <Text fw={600} size="xs">{t('receipt_total')}</Text>
                      <Text fw={700} size="sm" c="ocean">${priceBreakdown.total}</Text>
                    </Group>
                  </>
                );
              })()}
            </Stack>
          </Box>
        </Stack>
      </Card>

      <Group justify="space-between" mt="sm">
        <Button 
          variant="default" 
          size="sm"
          onClick={onBack} 
          disabled={loading}
          leftSection={<IconEdit size={14} />}
        >
          {t('step4_review_edit')}
        </Button>
        <Button 
          size="sm"
          onClick={onNext} 
          loading={loading}
          leftSection={<IconCheck size={14} />}
        >
          {t('step4_review_confirm')}
        </Button>
      </Group>
    </Stack>
  );
}
