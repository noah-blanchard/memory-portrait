'use client';

import { Group, Stack } from '@mantine/core';
import { Button } from '@/components/I18nUI/I18nUI';
import { DatePickerInput, TimePicker } from '@mantine/dates';
import type { UseFormReturnType } from '@mantine/form';
import ButtonNumberInput from '@/components/number/NumberInput';
import { useTranslation } from 'react-i18next';


export default function Step3Schedule({
  form,
  onBack,
  onNext,
  loading,
}: {
  form: UseFormReturnType<any>;
  onBack: () => void;
  onNext: () => void;
  loading: boolean;
}) {
  const { t } = useTranslation('common');
  
  return (
    <Stack gap="md">
      <DatePickerInput
        disabled={loading}
        label={t('step4_date')}
        withAsterisk
        minDate={new Date()}
        valueFormat="YYYY-MM-DD"
        dropdownType="modal"
        {...form.getInputProps('date')}
      />

      <TimePicker
        disabled={loading}
        label={t('step4_start_time')}
        minutesStep={15}
        withDropdown
        withAsterisk
        {...form.getInputProps('time')}
      />

      <ButtonNumberInput
        min={form.values.location === 'Quebec City' ? 4 : 1}
        disabled={loading}
        label={t('step4_duration')}
        value={form.values.durationHours}
        {...form.getInputProps('durationHours')}
      />

      <ButtonNumberInput
        label={t('step4_extra_edits')}
        description={t('step4_edits_included')}
        min={0}
        step={1}
        {...form.getInputProps('extraEdits')}
        required={false}
      />

      <Group justify="space-between" mt="md">
        <Button disabled={loading} variant="default" onClick={onBack}>
          common_back
        </Button>
        <Button loading={loading} onClick={onNext}>
          common_next_short
        </Button>
      </Group>
    </Stack>
  );
}