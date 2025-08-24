'use client';

import { Button, Group, rem, SegmentedControl, Stack } from '@mantine/core';
import { DatePickerInput, TimePicker } from '@mantine/dates';
import type { UseFormReturnType } from '@mantine/form';

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
        fullWidth
        size="lg"
        radius="xl"
        color="babyBlue"
        bg="babyBlue.2"
        disabled={loading}
        value={String(form.values.durationHours)}
        onChange={(v) => form.setFieldValue('durationHours', Number(v))}
        data={[
          { value: '1', label: '1 hour' },
          { value: '2', label: '2 hour' },
          { value: '3', label: '3 hour' },
          { value: '4', label: '4 hours' },
        ]}
        styles={{
          root: {
            background: 'var(--mantine-color-babyBlue-0)',
            padding: rem(4),
          },
          control: {
            flex: 1, // chaque item prend la même largeur
          },
          label: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: rem(38),
            gap: rem(6),
          },
          indicator: {
            boxShadow: `inset 0 0 0 2px var(--mantine-color-babyBlue-4)`,
          },
        }}
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
