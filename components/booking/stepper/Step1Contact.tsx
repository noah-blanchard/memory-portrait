'use client';

import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';

export type Step1Values = {
  clientName: string;
  contactMethod: string;
  contact: string;
};

export default function Step1Contact({
  form,
  onNext,
}: {
  form: UseFormReturnType<any>;
  onNext: () => void;
}) {
  return (
    <Stack gap="md">
      <TextInput
        label="Name / Nickname"
        placeholder="Jane"
        withAsterisk
        {...form.getInputProps('clientName')}
      />

      <Select
        label="Contact method"
        data={form.values.__contactMethodOptions ?? []}
        withAsterisk
        allowDeselect={false}
        {...form.getInputProps('contactMethod')}
      />

      <TextInput
        label="Contact"
        placeholder="jane@example.com / wechat id / @insta / +1…"
        withAsterisk
        {...form.getInputProps('contact')}
      />

      <Group justify="space-between" mt="md">
        <Button variant="default" disabled>
          Back
        </Button>
        <Button onClick={onNext}>Next step</Button>
      </Group>
    </Stack>
  );
}
