'use client';

import { Button, Group, SegmentedControl, Stack } from '@mantine/core';
import { DatePickerInput, TimePicker } from '@mantine/dates';
import type { UseFormReturnType } from '@mantine/form';

export default function Step3Schedule({
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
        value={form.values.date}
        onChange={(d) => form.setFieldValue('date', d)}
        withAsterisk
        minDate={new Date()}
        valueFormat="YYYY-MM-DD"
        error={form.errors.date}
        dropdownType="modal"
      />

      <TimePicker
        disabled={loading}
        label="Start time"
        withDropdown
        withAsterisk
        value={form.values.time}
        onChange={(v) => form.setFieldValue('time', v)}
        error={form.errors.time}
      />

      <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>Duration (hours)</label>
      <SegmentedControl
        disabled={loading}
        bg={"babyblue.2"}
        fullWidth
        size="lg" // plus grand et tactile-friendly
        radius="xl"
        color="babyBlue"
        value={String(form.values.durationHours)}
        onChange={(v) => form.setFieldValue('durationHours', Number(v))}
        data={[
          { value: '1', label: '1 hour' },
          { value: '2', label: '2 hour' },
          { value: '3', label: '3 hour' },
        ]}
      />

      <Group justify="space-between" mt="md">
        <Button disabled={loading} variant="default" onClick={onBack}>
          Back
        </Button>
        <Button loading={loading} onClick={onSubmit}>
          Send request
        </Button>
      </Group>
    </Stack>
  );
}
