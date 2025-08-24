'use client';

import { useEffect } from 'react';
import {
  Badge,
  Button,
  Card,
  Group,
  NumberInput,
  Stack,
  Switch,
  Text,
  Title,
  Alert,
} from '@mantine/core';
import { IconAperture, IconCamera, IconDeviceMobile, IconInfoCircle } from '@tabler/icons-react';
import type { UseFormReturnType } from '@mantine/form';

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

  // DSLR en add-on uniquement si on a déjà un package CCD/Phone
  const dslrAsAddon = hasDslr && hasCcdOrPhone;
  // DSLR seul => on bloque CCD/Phone (packages exclusifs)
  const dslrExclusive = hasDslr && !hasCcdOrPhone;

  // Nettoyage du nombre de photos si l'add-on n'est plus applicable
  useEffect(() => {
    if (!dslrAsAddon && v.dslrAddonPhotos != null) {
      form.setFieldValue('dslrAddonPhotos', undefined);
    }
  }, [dslrAsAddon, v.dslrAddonPhotos, form]);

  return (
    <Stack gap="lg">
      {/* CCD Cameras */}
      <Card withBorder radius="md" p="md">
        <Group gap="xs" mb="xs">
          <IconCamera size={18} />
          <Title order={5}>CCD Cameras</Title>
          <Badge variant="light">2</Badge>
        </Group>

        <Stack gap="xs">
          <EquipSwitch
            title="Canon ixus980is"
            note="Soft warm tones / cool white skin tones"
            disabled={dslrExclusive} // bloqué si DSLR seul
            {...form.getInputProps('equipCanonIxus980is', { type: 'checkbox' })}
          />
          <EquipSwitch
            title="HP (CCD)"
            note="Vintage look • great flash (iPhone 5s vibes)"
            disabled={dslrExclusive}
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
        </Group>

        <Stack gap="xs">
          <EquipSwitch
            title="iPhone X"
            note="Natural skin softening • ambiance king"
            disabled={dslrExclusive}
            {...form.getInputProps('equipIphoneX', { type: 'checkbox' })}
          />
          <EquipSwitch
            title="iPhone 13"
            note="Latest gen colors"
            disabled={dslrExclusive}
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
        </Group>

        <EquipSwitch
          title="Nikon (DSLR)"
          // Pas besoin de disabled ici : c'est l'élément qui impose l'exclusivité
          {...form.getInputProps('equipNikonDslr', { type: 'checkbox' })}
        />

        {/* Add-on : visible uniquement si DSLR + (CCD ou Phone) */}
        {dslrAsAddon && (
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

      {/* Messages d’aide */}
      {dslrExclusive ? (
        <Alert color="yellow" icon={<IconInfoCircle size={16} />}>
          <b>DSLR package</b> is selected: CCD and Phone packages are disabled (exclusive).
        </Alert>
      ) : (
        <Text size="sm" c="dimmed">
          Choose any <b>CCD / Phone</b> package. You may then add <b>DSLR photos</b> as an add-on.
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
        body: { alignItems: 'flex-start' }, // aligne bien le label/description avec le thumb
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
