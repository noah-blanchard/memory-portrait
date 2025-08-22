"use client";

import { Stack, Select, TextInput, Group, Button } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";

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
      <Select
        label="Photoshoot type"
        data={form.values.__photoshootOptions ?? []}
        withAsterisk
        allowDeselect={false}
        {...form.getInputProps("photoshootKind")}
      />

      <TextInput
        label="Location (city in Quebec)"
        placeholder="Montreal, QC"
        withAsterisk
        {...form.getInputProps("location")}
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
