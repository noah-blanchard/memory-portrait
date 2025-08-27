'use client';

import {
  IconBrandInstagram,
  IconBrandWechat,
} from '@tabler/icons-react';
import {
  Button,
  Flex,
  Group,
  NativeSelect,
  
  Stack,
  TextInput,
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';

export type Step1Values = {
  clientName: string;
  contactMethod: string;
  contact: string;
};

const methodIcon = (m: Step1Values['contactMethod'], size = 16) => {
  switch (m) {
    case 'wechat':
      return <IconBrandWechat size={size} />;
    case 'instagram':
      return <IconBrandInstagram size={size} />;
  }
};

const placeholderByMethod: Record<Step1Values['contactMethod'], string> = {
  wechat: 'wechat_id',
  instagram: 'instagram_username',
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

      <Stack gap="md" w="100%">
        <NativeSelect
          withAsterisk
          label="Contact"
          leftSection={methodIcon(form.values.contactMethod, 18)}
          data={[
            { value: 'wechat', label: 'WeChat' },
            { value: 'instagram', label: 'Instagram' },
          ]}
          value={form.values.contactMethod}
          onChange={(event) =>
            form.setFieldValue(
              'contactMethod',
              event.currentTarget.value as Step1Values['contactMethod']
            )
          }
        />
        {/* Champ contact assorti (icône à gauche, placeholder dynamique) */}
        <TextInput
          style={{ flex: 1 }} // pour prendre le reste de l'espace
          mt="xs"
          leftSection={methodIcon(form.values.contactMethod, 18)}
          placeholder={placeholderByMethod[form.values.contactMethod]}
          withAsterisk
          {...form.getInputProps('contact')}
        />
        {/* <SegmentedControl
          fullWidth
          size="lg"
          radius="xl"
          color="babyBlue"
          bg="babyBlue.2"
          value={form.values.contactMethod}
          onChange={(v) => form.setFieldValue('contactMethod', v as Step1Values['contactMethod'])}
          data={[
            {
              value: 'wechat',
              label: <Tooltip label="WeChat">{methodIcon('wechat', 18)}</Tooltip>,
            },
            {
              value: 'instagram',
              label: <Tooltip label="Instagram">{methodIcon('instagram', 18)}</Tooltip>,
            },
            {
              value: 'phone',
              label: <Tooltip label="Phone">{methodIcon('phone', 18)}</Tooltip>,
            },
          ]}
          // 🎨 style doux + items égaux
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
        /> */}
      </Stack>

      <Group justify="space-between" mt="md">
        <Button variant="default" disabled>
          Back
        </Button>
        <Button onClick={onNext}>Next step</Button>
      </Group>
    </Stack>
  );
}
