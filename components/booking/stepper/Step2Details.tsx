'use client';

import { IconClover, IconSailboat } from '@tabler/icons-react';
import {
  Group,
  NativeSelect,
  SegmentedControl,
  Stack,
} from '@mantine/core';
import { Button, InputLabel } from '@/components/I18nUI/I18nUI';
import type { UseFormReturnType } from '@mantine/form';
import ButtonNumberInput from '@/components/number/NumberInput';
import { useTranslation } from 'react-i18next';

export default function Step2Details({
  form,
  onBack,
  onNext,
}: {
  form: UseFormReturnType<any>;
  onBack: () => void;
  onNext: () => void;
}) {
  const { t } = useTranslation('common');
  
  const photoshootOptions = [
    { value: 'portrait', label: t('photoshoot_portrait') },
    { value: 'tourism', label: t('photoshoot_tourism') },
    { value: 'family', label: t('photoshoot_family') },
    { value: 'linkedin', label: t('photoshoot_linkedin') },
    { value: 'event', label: t('photoshoot_event') },
  ];
  
  return (
    <Stack gap="md">
      <NativeSelect
        label={t('step2_photoshoot_type')}
        data={photoshootOptions}
        withAsterisk
        {...form.getInputProps('photoshootKind')}
      />

      <InputLabel size="lg" fw={600} required>
        {t('step2_location')}
      </InputLabel>
      <SegmentedControl
        defaultValue="Montreal"
        data={[
          {
            label: (
              <>
                <IconClover size={20} style={{ marginRight: 6 }} />
                {t('step2_montreal')}
              </>
            ),
            value: 'Montreal',
          },
          {
            label: (
              <>
                <IconSailboat size={20} style={{ marginRight: 6 }} />
                {t('step2_quebec_city')}
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

      <ButtonNumberInput label={t('step2_people_count')} {...form.getInputProps('peopleCount')} />

      <Group justify="space-between" mt="md">
        <Button variant="default" onClick={onBack}>
          common_back
        </Button>
        <Button onClick={onNext}>common_next</Button>
      </Group>
    </Stack>
  );
}
