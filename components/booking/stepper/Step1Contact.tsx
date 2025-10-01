'use client';

import {
  IconBrandInstagram,
  IconBrandWechat,
} from '@tabler/icons-react';
import {
  Group,
  NativeSelect,
  Stack,
  TextInput,
} from '@mantine/core';
import { Button } from '@/components/I18nUI/I18nUI';
import type { UseFormReturnType } from '@mantine/form';
import { useTranslation } from 'react-i18next';

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

export default function Step1Contact({
  form,
  onNext,
}: {
  form: UseFormReturnType<any>;
  onNext: () => void;
}) {
  const { t } = useTranslation('common');
  
  const placeholderByMethod: Record<Step1Values['contactMethod'], string> = {
    wechat: t('step1_wechat_placeholder'),
    instagram: t('step1_instagram_placeholder'),
  };

  return (
    <Stack gap="md">
      <TextInput
        label={t('step1_name_label')}
        placeholder={t('step1_name_placeholder')}
        withAsterisk
        {...form.getInputProps('clientName')}
      />

      <Stack gap="md" w="100%">
        <NativeSelect
          withAsterisk
          label={t('step1_contact_label')}
          leftSection={methodIcon(form.values.contactMethod, 18)}
          data={[
            { value: 'wechat', label: t('step1_wechat') },
            { value: 'instagram', label: t('step1_instagram') },
          ]}
          value={form.values.contactMethod}
          onChange={(event) =>
            form.setFieldValue(
              'contactMethod',
              event.currentTarget.value as Step1Values['contactMethod']
            )
          }
        />
        <TextInput
          style={{ flex: 1 }}
          mt="xs"
          leftSection={methodIcon(form.values.contactMethod, 18)}
          placeholder={placeholderByMethod[form.values.contactMethod]}
          withAsterisk
          {...form.getInputProps('contact')}
        />
      </Stack>

      <Group justify="space-between" mt="md">
        <Button variant="default" disabled>
          common_back
        </Button>
        <Button onClick={onNext}>common_next</Button>
      </Group>
    </Stack>
  );
}
