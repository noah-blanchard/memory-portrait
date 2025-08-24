'use client';

import { useEffect } from 'react';
import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';

export default function Step2Details({
  form,
  onBack,
  onNext,
}: {
  form: UseFormReturnType<any>;
  onBack: () => void;
  onNext: () => void;
}) {
  // Force "Montreal" si pas déjà défini
  useEffect(() => {
    if (!form.values.location || form.values.location.trim() === '') {
      form.setFieldValue('location', 'Montreal');
    }
  }, [form]);

  return (
    <Stack gap="md">
      <Select
        label="Photoshoot type"
        data={form.values.__photoshootOptions ?? []}
        withAsterisk
        allowDeselect={false}
        {...form.getInputProps('photoshootKind')}
      />

      <TextInput
        label="Location"
        description="For now, only Montreal is available."
        withAsterisk
        disabled
        {...form.getInputProps('location')}
      />

      <Group justify="space-between" mt="md">
        <Button variant="default" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next step</Button>
      </Group>
    </Stack>
  );
}
