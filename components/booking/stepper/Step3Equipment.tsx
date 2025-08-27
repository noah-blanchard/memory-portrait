'use client';

import { useEffect } from 'react';
import { IconAperture, IconCamera, IconDeviceMobile, IconInfoCircle } from '@tabler/icons-react';
import { Alert, Badge, Button, Card, Group, NumberInput, Stack, Switch, Text, Title } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import ButtonNumberInput from '@/components/number/NumberInput';


type Props = {
  form: UseFormReturnType<any>;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
};

export default function Step3Equipment({ form, loading, onBack, onNext }: Props) {
  const v = form.values;

  const hasCCD = !!v.equipCanonIxus980is || !!v.equipHpCcd;
  const hasPhone = !!v.equipIphoneX || !!v.equipIphone13;
  const hasCcdOrPhone = hasCCD || hasPhone;
  const hasDslr = !!v.equipNikonDslr;

  const isQuebecCity = v.location === 'Quebec City';

  // Nikon sélectionné + durée >= 2h => CCD/Phone inclus
  const includesCcdPhone = hasDslr && Number(v.durationHours) >= 2;

  // DSLR en add-on uniquement si on a déjà un package CCD/Phone
  const dslrAsAddon = hasDslr && hasCcdOrPhone;
  // DSLR seul => on bloque CCD/Phone (packages exclusifs)
  const dslrExclusive = hasDslr && !hasCcdOrPhone;

  // ✅ Québec City : Nikon obligatoire → auto-select + verrouillage
  useEffect(() => {
    if (isQuebecCity && !hasDslr) {
      form.setFieldValue('equipNikonDslr', true);
    }
  }, [isQuebecCity, hasDslr, form]);

  // ✅ Nikon 2h+ : auto-select CCD/Phone car inclus
  useEffect(() => {
    if (includesCcdPhone) {
      if (!v.equipCanonIxus980is) form.setFieldValue('equipCanonIxus980is', true);
      if (!v.equipHpCcd) form.setFieldValue('equipHpCcd', true);
      if (!v.equipIphoneX) form.setFieldValue('equipIphoneX', true);
      if (!v.equipIphone13) form.setFieldValue('equipIphone13', true);
    }
  }, [
    includesCcdPhone,
    v.equipCanonIxus980is,
    v.equipHpCcd,
    v.equipIphoneX,
    v.equipIphone13,
    form,
  ]);

  // Nettoyage du nombre de photos si l'add-on n'est plus applicable
  useEffect(() => {
    if (!(dslrAsAddon && !includesCcdPhone) && v.dslrAddonPhotos != null) {
      // add-on DSLR affiché uniquement quand DSLR est en add-on (pack principal = CCD/Phone)
      form.setFieldValue('dslrAddonPhotos', undefined);
    }
  }, [dslrAsAddon, includesCcdPhone, v.dslrAddonPhotos, form]);

  return (
    <Stack gap="lg">
      {/* CCD Cameras */}
      <Card withBorder radius="md" p="md">
        <Group gap="xs" mb="xs">
          <IconCamera size={18} />
          <Title order={5}>CCD Cameras</Title>
          <Badge variant="light">2</Badge>
          {includesCcdPhone && <Badge color="green">Included (≥ 2h DSLR)</Badge>}
        </Group>

        <Stack gap="xs">
          <EquipSwitch
            title="CCD • Canon ixus980is"
            note="Soft warm tones • cool white skin tones"
            disabled={dslrExclusive || includesCcdPhone}
            {...form.getInputProps('equipCanonIxus980is', { type: 'checkbox' })}
          />
          <EquipSwitch
            title="CCD • HP"
            note="Vintage look • great flash (iPhone 5s vibes)"
            disabled={dslrExclusive || includesCcdPhone}
            {...form.getInputProps('equipHpCcd', { type: 'checkbox' })}
          />
        </Stack>
      </Card>

      {/* Phones */}
      <Card withBorder radius="md" p="md">
        <Group gap="xs" mb="xs">
          <IconDeviceMobile size={18} />
          <Title order={5}>Phones</Title>
          <Badge variant="light">2</Badge>
          {includesCcdPhone && <Badge color="green">Included (≥ 2h DSLR)</Badge>}
        </Group>

        <Stack gap="xs">
          <EquipSwitch
            title="iPhone X"
            note="Natural skin softening • ambiance king"
            disabled={dslrExclusive || includesCcdPhone}
            {...form.getInputProps('equipIphoneX', { type: 'checkbox' })}
          />
          <EquipSwitch
            title="iPhone 13"
            note="Latest gen colors"
            disabled={dslrExclusive || includesCcdPhone}
            {...form.getInputProps('equipIphone13', { type: 'checkbox' })}
          />
        </Stack>
      </Card>

      {/* DSLR */}
      <Card withBorder radius="md" p="md">
        <Group gap="xs" mb="xs">
          <IconAperture size={18} />
          <Title order={5}>DSLR</Title>
          <Badge variant="light">1</Badge>
          {isQuebecCity && <Badge color="red">Required in Quebec City</Badge>}
        </Group>

        <EquipSwitch
          title="DSLR • Nikon"
          readOnly={isQuebecCity || loading}
          disabled={loading} // verrouillé à QC
          {...form.getInputProps('equipNikonDslr', { type: 'checkbox' })}
        />

        {/* Add-on : visible uniquement si DSLR + (CCD ou Phone) ET pas en mode "inclus" */}
        {dslrAsAddon && !includesCcdPhone && (
          <NumberInput
            mt="sm"
            label="DSLR photos (add-on)"
            description="Only as an add-on with CCD/Phone packages • $3/photo • Minimum 3 photos"
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
          <b>Nikon (DSLR)</b> is required in <b>Quebec City</b>.
        </Alert>
      ) : includesCcdPhone ? (
        <Alert color="green" icon={<IconInfoCircle size={16} />}>
          <b>CCD &amp; Phone</b> included with <b>2h+</b> <b>Nikon (DSLR)</b>.
        </Alert>
      ) : dslrExclusive ? (
        <Alert color="yellow" icon={<IconInfoCircle size={16} />}>
          <b>DSLR</b> selected: CCD and Phone disabled.
        </Alert>
      ) : (
        <Text size="sm" c="dimmed">
          Select <b>CCD / Phone</b>. Add <b>DSLR photos</b> as an add-on.
        </Text>
      )}

      <Group justify="space-between" mt="md">
        <Button variant="default" onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button onClick={onNext} loading={loading}>
          Next
        </Button>
      </Group>
    </Stack>
  );
}

/** Switch stylé : aligné en haut + label/description propres */
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