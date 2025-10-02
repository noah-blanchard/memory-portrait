'use client';

import { useEffect, useState } from 'react';
import { IconCalendar, IconSparkles } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Box, Group, Paper, rem, Stack, Text, Transition, useMantineTheme } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useMediaQuery } from '@mantine/hooks';
import ButtonNumberInput from '@/components/number/NumberInput';
import TimeInput from '@/components/time/TimeInput';
import type { BookingStepProps } from '@/types/components';

export interface Step3ScheduleValues {
  date: Date | null;
  time: string;
  durationHours: number;
  extraEdits?: number;
}

export interface Step3ScheduleProps extends BookingStepProps {
  // Full navigation available in step 3
}

export default function Step3Schedule({
  form,
  onBack: _onBack,
  onNext: _onNext,
  loading: _loading = false,
}: Step3ScheduleProps) {
  const { t } = useTranslation('common');
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isQuebecCity = form.values.location === 'Quebec City';
  const minDuration = isQuebecCity ? 4 : 1;

  return (
    <Transition mounted={mounted} transition="fade" duration={400}>
      {(styles) => (
        <Box style={styles}>
          <Stack gap={isMobile ? 'lg' : 'md'}>
            {/* Step Header */}
            <Box ta="center" mb="xs">
              <Text size={isMobile ? 'sm' : 'md'} fw={600} c="dimmed">
                {t('step3_schedule_title')}
              </Text>
              <Text size="xs" c="dimmed" mt={2}>
                {t('step4_start_time')} & {t('step4_duration')}
              </Text>
            </Box>

            {/* Date Selection */}
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
              <DatePickerInput
                disabled={_loading}
                label={t('step4_date')}
                withAsterisk
                minDate={new Date()}
                valueFormat="YYYY-MM-DD"
                dropdownType={isMobile ? 'modal' : 'popover'}
                placeholder={t('step4_date_placeholder')}
                leftSection={<IconCalendar size={isMobile ? 18 : 16} />}
                size={isMobile ? 'md' : 'sm'}
                {...form.getInputProps('date')}
              />
            </Paper>

            {/* Time Selection */}
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
              <TimeInput
                disabled={_loading}
                label={t('step4_start_time')}
                required
                size={isMobile ? 'md' : 'sm'}
                min="06:00"
                max="22:00"
                {...form.getInputProps('time')}
              />
            </Paper>

            {/* Duration */}
            <Paper
              p={isMobile ? 'md' : 'sm'}
              radius="lg"
              withBorder
              style={{
                background: `linear-gradient(135deg, ${theme.colors.slate[0]} 0%, ${theme.colors.rose[0]} 100%)`,
                border: `1px solid ${theme.colors.slate[2]}`,
                transition: 'all 0.2s ease',
              }}
            >
              <ButtonNumberInput
                min={minDuration}
                disabled={_loading}
                label={t('step4_duration')}
                value={form.values.durationHours}
                {...form.getInputProps('durationHours')}
              />

              {/* Duration info */}
              {isQuebecCity && (
                <Box
                  mt="sm"
                  p="sm"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.emerald[1]} 0%, ${theme.colors.ocean[1]} 100%)`,
                    borderRadius: rem(8),
                    border: `1px solid ${theme.colors.emerald[2]}`,
                  }}
                >
                  <Group gap="xs" mb="xs">
                    <IconSparkles size={16} color={theme.colors.emerald[6]} />
                    <Text size="xs" fw={600} c="emerald">
                      {t('step3_required_qc')}
                    </Text>
                  </Group>
                </Box>
              )}
            </Paper>

            {/* Extra Edits */}
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
              <ButtonNumberInput
                label={t('step4_extra_edits')}
                description={t('step4_edits_included')}
                min={0}
                step={1}
                {...form.getInputProps('extraEdits')}
                required={false}
              />
            </Paper>
          </Stack>
        </Box>
      )}
    </Transition>
  );
}
