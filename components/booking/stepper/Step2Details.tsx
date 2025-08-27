'use client';

import { IconClover, IconSailboat } from '@tabler/icons-react';
import {
  Button,
  Group,
  InputLabel,
  NativeSelect,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import ButtonNumberInput from '@/components/number/NumberInput';

export default function Step2Details({
  form,
  onBack,
  onNext,
}: {
  form: UseFormReturnType<any>;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <Stack gap="md">
      <NativeSelect
        label="Photoshoot type"
        data={form.values.__photoshootOptions ?? []}
        withAsterisk
        {...form.getInputProps('photoshootKind')}
      />

      <InputLabel size="lg" fw={600} required>
        Location
      </InputLabel>
      <SegmentedControl
        defaultValue="Montreal"
        data={[
          {
            label: (
              <>
                <IconClover size={20} style={{ marginRight: 6 }} />
                Montreal
              </>
            ),
            value: 'Montreal',
          },
          {
            label: (
              <>
                <IconSailboat size={20} style={{ marginRight: 6 }} />
                Quebec City
              </>
            ),
            value: 'Quebec City',
          },
        ]}
        fullWidth
        {...form.getInputProps('location')}
        onChange={(value) => {
          form.setFieldValue('location', value);
          if (value === 'Quebec City') {
            form.setFieldValue('durationHours', 4);
          } else {
            form.setFieldValue('durationHours', 1);
          }
        }}
      />

      {/* <NumberInput label="Number of people" min={1} {...form.getInputProps('peopleCount')} /> */}
      <ButtonNumberInput label="Number of people" {...form.getInputProps('peopleCount')} />

      <Group justify="space-between" mt="md">
        <Button variant="default" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next step</Button>
      </Group>
    </Stack>
  );
}
