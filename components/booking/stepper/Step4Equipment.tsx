'use client';

import { useEffect } from 'react';
import { IconAperture, IconCamera, IconDeviceMobile, IconInfoCircle } from '@tabler/icons-react';
import { Card, Group, NumberInput, Stack, Switch } from '@mantine/core';
import { Alert, Badge, Button, Text, Title } from '@/components/I18nUI/I18nUI';
import type { UseFormReturnType } from '@mantine/form';
import { useTranslation } from 'react-i18next';


type Props = {
  form: UseFormReturnType<any>;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
};

export default function Step4Equipment({ form, loading, onBack, onNext }: Props) {
  const { t } = useTranslation('common');
  const v = form.values;

  const hasCCD = !!v.equipCanonIxus980is || !!v.equipHpCcd;
  const hasPhone = !!v.equipIphoneX || !!v.equipIphone13;
  const hasCcdOrPhone = hasCCD || hasPhone;
  const hasDslr = !!v.equipNikonDslr;

  const isQuebecCity = v.location === 'Quebec City';

  const includesCcdPhone = hasDslr && Number(v.durationHours) >= 2;

  const dslrAsAddon = hasDslr && hasCcdOrPhone;
  const dslrExclusive = hasDslr && !hasCcdOrPhone;

  useEffect(() => {
    if (isQuebecCity && !hasDslr) {
      form.setFieldValue('equipNikonDslr', true);
    }
  }, [isQuebecCity, hasDslr, form]);

  useEffect(() => {
    if (includesCcdPhone) {
      if (!v.equipCanonIxus980is) {
        form.setFieldValue('equipCanonIxus980is', true);
      }
      if (!v.equipHpCcd) {
        form.setFieldValue('equipHpCcd', true);
      }
      if (!v.equipIphoneX) {
        form.setFieldValue('equipIphoneX', true);
      }
      if (!v.equipIphone13) {
        form.setFieldValue('equipIphone13', true);
      }
    }
  }, [
    includesCcdPhone,
    v.equipCanonIxus980is,
    v.equipHpCcd,
    v.equipIphoneX,
    v.equipIphone13,
    form,
  ]);

  useEffect(() => {
    if (!(dslrAsAddon && !includesCcdPhone) && v.dslrAddonPhotos != null) {
      form.setFieldValue('dslrAddonPhotos', undefined);
    }
  }, [dslrAsAddon, includesCcdPhone, v.dslrAddonPhotos, form]);

  return (
    <Stack gap="lg">
      <Card withBorder radius="md" p="md">
        <Group gap="xs" mb="xs">
          <IconCamera size={18} />
          <Title order={5}>step3_ccd_cameras</Title>
          <Badge variant="light">2</Badge>
          {includesCcdPhone && <Badge color="green">step3_included</Badge>}
        </Group>

        <Stack gap="xs">
          <EquipSwitch
            title={t('step3_canon_title')}
            note={t('step3_canon_note')}
            disabled={dslrExclusive || includesCcdPhone}
            {...form.getInputProps('equipCanonIxus980is', { type: 'checkbox' })}
          />
          <EquipSwitch
            title={t('step3_hp_title')}
            note={t('step3_hp_note')}
            disabled={dslrExclusive || includesCcdPhone}
            {...form.getInputProps('equipHpCcd', { type: 'checkbox' })}
          />
        </Stack>
      </Card>

      <Card withBorder radius="md" p="md">
        <Group gap="xs" mb="xs">
          <IconDeviceMobile size={18} />
          <Title order={5}>step3_phones</Title>
          <Badge variant="light">2</Badge>
          {includesCcdPhone && <Badge color="green">step3_included</Badge>}
        </Group>

        <Stack gap="xs">
          <EquipSwitch
            title={t('step3_iphone_x_title')}
            note={t('step3_iphone_x_note')}
            disabled={dslrExclusive || includesCcdPhone}
            {...form.getInputProps('equipIphoneX', { type: 'checkbox' })}
          />
          <EquipSwitch
            title={t('step3_iphone_13_title')}
            note={t('step3_iphone_13_note')}
            disabled={dslrExclusive || includesCcdPhone}
            {...form.getInputProps('equipIphone13', { type: 'checkbox' })}
          />
        </Stack>
      </Card>

      <Card withBorder radius="md" p="md">
        <Group gap="xs" mb="xs">
          <IconAperture size={18} />
          <Title order={5}>step3_dslr</Title>
          <Badge variant="light">1</Badge>
          {isQuebecCity && <Badge color="red">step3_required_qc</Badge>}
        </Group>

        <EquipSwitch
          title={t('step3_nikon_title')}
          readOnly={isQuebecCity || loading}
          disabled={loading}
          {...form.getInputProps('equipNikonDslr', { type: 'checkbox' })}
        />

        {dslrAsAddon && !includesCcdPhone && (
          <NumberInput
            mt="sm"
            label={t('step3_dslr_addon_label')}
            description={t('step3_dslr_addon_desc')}
            min={3}
            step={1}
            hideControls={false}
            allowNegative={false}
            clampBehavior="strict"
            disabled={loading}
            {...form.getInputProps('dslrAddonPhotos')}
          />
        )}
      </Card>

      {isQuebecCity ? (
        <Alert color="red" icon={<IconInfoCircle size={16} />}>
          <b>{t('step3_nikon_title')}</b> {t('step3_alert_qc')} <b>{t('step2_quebec_city')}</b>.
        </Alert>
      ) : includesCcdPhone ? (
        <Alert color="green" icon={<IconInfoCircle size={16} />}>
          <b>{t('step3_ccd_phone')}</b> {t('step3_alert_included')} <b>2h+</b> <b>{t('step3_nikon_title')}</b>.
        </Alert>
      ) : dslrExclusive ? (
        <Alert color="yellow" icon={<IconInfoCircle size={16} />}>
          <b>{t('step3_dslr')}</b> {t('step3_alert_dslr_exclusive')}
        </Alert>
      ) : (
        <Text size="sm" c="dimmed">
          {t('step3_alert_select')} <b>{t('step3_ccd_phone')}</b>. {t('step3_alert_add')} <b>{t('step3_dslr_photos')}</b> {t('step3_alert_addon')}
        </Text>
      )}

      <Group justify="space-between" mt="md">
        <Button variant="default" onClick={onBack} disabled={loading}>
          common_back
        </Button>
        <Button onClick={onNext} loading={loading}>
          common_next_short
        </Button>
      </Group>
    </Stack>
  );
}

function EquipSwitch({
  title,
  note,
  ...rest
}: {
  title: string;
  note?: string;
} & React.ComponentProps<typeof Switch>) {
  return (
    <Switch
      size="md"
      label={title}
      description={note}
      styles={(theme) => ({
        body: { alignItems: 'flex-start' },
        label: { fontWeight: 600, lineHeight: 1.2 },
        description: {
          lineHeight: 1.2,
          marginTop: 2,
          color: theme.colors.gray[6],
        },
      })}
      {...rest}
    />
  );
}