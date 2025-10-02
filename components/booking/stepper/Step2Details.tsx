'use client';

import { useEffect, useState } from 'react';
import { IconCamera, IconClover, IconMapPin, IconSailboat } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Group,
  NativeSelect,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Transition,
  useMantineTheme,
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { InputLabel } from '@/components/I18nUI/I18nUI';
import ButtonNumberInput from '@/components/number/NumberInput';

export default function Step2Details({
  form,
  onBack: _onBack,
  onNext: _onNext,
}: {
  form: UseFormReturnType<any>;
  onBack: () => void;
  onNext: () => void;
}) {
  const { t } = useTranslation('common');
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mounted, setMounted] = useState(false);
  const [locationChanged, setLocationChanged] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const photoshootOptions = [
    { value: 'portrait', label: t('photoshoot_portrait') },
    { value: 'tourism', label: t('photoshoot_tourism') },
    { value: 'family', label: t('photoshoot_family') },
    { value: 'linkedin', label: t('photoshoot_linkedin') },
    { value: 'event', label: t('photoshoot_event') },
  ];

  const handleLocationChange = (value: string) => {
    setLocationChanged(true);
    form.setFieldValue('location', value);
    if (value === 'Quebec City') {
      form.setFieldValue('durationHours', 4);
    } else {
      form.setFieldValue('durationHours', 1);
    }
    setTimeout(() => setLocationChanged(false), 300);
  };

  return (
    <Transition mounted={mounted} transition="fade" duration={400}>
      {(styles) => (
        <Box style={styles}>
          <Stack gap={isMobile ? 'lg' : 'md'}>
            {/* Step Header */}
            <Box ta="center" mb="xs">
              <Text size={isMobile ? 'sm' : 'md'} fw={600} c="dimmed">
                {t('step2_photoshoot_type')}
              </Text>
              <Text size="xs" c="dimmed" mt={2}>
                {t('step2_location')} & {t('step2_people_count')}
              </Text>
            </Box>

            {/* Photoshoot Type Selection */}
            <Paper
              p={isMobile ? 'md' : 'sm'}
              radius="lg"
              withBorder
              style={{
                background: `linear-gradient(135deg, ${theme.colors.slate[0]} 0%, ${theme.colors.emerald[0]} 100%)`,
                border: `1px solid ${theme.colors.slate[2]}`,
                transition: 'all 0.2s ease',
              }}
            >
              <NativeSelect
                label={t('step2_photoshoot_type')}
                data={photoshootOptions}
                withAsterisk
                leftSection={<IconCamera size={isMobile ? 18 : 16} />}
                size={isMobile ? 'md' : 'sm'}
                {...form.getInputProps('photoshootKind')}
              />
            </Paper>

            {/* Location Selection */}
            <Paper
              p={isMobile ? 'md' : 'sm'}
              radius="lg"
              withBorder
              style={{
                background: `linear-gradient(135deg, ${theme.colors.slate[0]} 0%, ${theme.colors.ocean[0]} 100%)`,
                border: `1px solid ${theme.colors.slate[2]}`,
                transition: 'all 0.2s ease',
              }}
            >
              <InputLabel size={isMobile ? 'md' : 'sm'} fw={600} required mb="sm">
                <Group gap="xs">
                  <IconMapPin size={isMobile ? 16 : 14} />
                  {t('step2_location')}
                </Group>
              </InputLabel>

              <SegmentedControl
                value={form.values.location}
                data={[
                  {
                    label: (
                      <Group gap="xs" p="xs">
                        <IconClover size={isMobile ? 18 : 16} />
                        <Text size={isMobile ? 'sm' : 'xs'} fw={500}>
                          {t('step2_montreal')}
                        </Text>
                      </Group>
                    ),
                    value: 'Montreal',
                  },
                  {
                    label: (
                      <Group gap="xs" p="xs">
                        <IconSailboat size={isMobile ? 18 : 16} />
                        <Text size={isMobile ? 'sm' : 'xs'} fw={500}>
                          {t('step2_quebec_city')}
                        </Text>
                      </Group>
                    ),
                    value: 'Quebec City',
                  },
                ]}
                fullWidth
                size={isMobile ? 'md' : 'sm'}
                onChange={handleLocationChange}
              />
            </Paper>

            {/* People Count */}
            <Transition mounted transition="slide-up" duration={300} timingFunction="ease-out">
              {(peopleStyles) => (
                <Paper
                  p={isMobile ? 'md' : 'sm'}
                  radius="lg"
                  withBorder
                  style={{
                    ...peopleStyles,
                    background: `linear-gradient(135deg, ${theme.colors.slate[0]} 0%, ${theme.colors.rose[0]} 100%)`,
                    border: `1px solid ${theme.colors.slate[2]}`,
                    transition: 'all 0.2s ease',
                    transform: locationChanged ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  <ButtonNumberInput
                    label={t('step2_people_count')}
                    {...form.getInputProps('peopleCount')}
                  />
                </Paper>
              )}
            </Transition>
          </Stack>
        </Box>
      )}
    </Transition>
  );
}
