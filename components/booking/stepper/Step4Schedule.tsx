'use client';

import { Button, Group, NumberInput, rem, SegmentedControl, Stack } from '@mantine/core';
import { DatePickerInput, TimePicker } from '@mantine/dates';
import type { UseFormReturnType } from '@mantine/form';
import ButtonNumberInput from '@/components/number/NumberInput';


export default function Step4Schedule({
  form,
  onBack,
  onSubmit,
  loading,
}: {
  form: UseFormReturnType<any>;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <Stack gap="md">
      <DatePickerInput
        disabled={loading}
        label="Date"
        withAsterisk
        minDate={new Date()}
        valueFormat="YYYY-MM-DD"
        dropdownType="modal"
        {...form.getInputProps('date')}
      />

      <TimePicker
        disabled={loading}
        label="Start time"
        minutesStep={15}
        withDropdown
        withAsterisk
        {...form.getInputProps('time')}
      />

      <ButtonNumberInput
        min={form.values.location === 'Quebec City' ? 4 : 1}
        disabled={loading}
        label="Duration (hours)"
        value={form.values.durationHours}
        {...form.getInputProps('durationHours')}
      />

      <ButtonNumberInput
        label="Extra edits (3$ / edits)"
        description="4 included"
        min={0}
        step={1}
        {...form.getInputProps('extraEdits')}
        required={false}
      />

      <Group justify="space-between" mt="md">
        <Button disabled={loading} variant="default" onClick={onBack}>
          Back
        </Button>
        <Button loading={loading} onClick={onSubmit}>
          Next
        </Button>
      </Group>
    </Stack>
  );
}