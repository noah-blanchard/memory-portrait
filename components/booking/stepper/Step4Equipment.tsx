'use client';

import { useEffect, useState } from 'react';
import {
  IconAperture,
  IconCamera,
  IconCheck,
  IconDeviceMobile,
  IconInfoCircle,
  IconSparkles,
  IconX,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Box,
  Group,
  NumberInput,
  Paper,
  rem,
  Stack,
  Switch,
  Text,
  Transition,
  useMantineTheme,
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { Alert, Title } from '@/components/I18nUI/I18nUI';

type Props = {
  form: UseFormReturnType<any>;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
};

export default function Step4Equipment({
  form,
  loading: _loading,
  onBack: _onBack,
  onNext: _onNext,
}: Props) {
  const { t } = useTranslation('common');
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mounted, setMounted] = useState(false);
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
    setMounted(true);
  }, []);

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
    <Transition mounted={mounted} transition="fade" duration={400}>
      {(styles) => (
        <Box style={styles}>
          <Stack gap={isMobile ? 'lg' : 'md'}>
            {/* Step Header */}
            <Box ta="center" mb="xs">
              <Text size={isMobile ? 'sm' : 'md'} fw={600} c="dimmed">
                {t('step3_ccd_cameras')}
              </Text>
              <Text size="xs" c="dimmed" mt={2}>
                {t('step3_phones')} & {t('step3_dslr')}
              </Text>
            </Box>

            {/* CCD Cameras */}
            <Paper
              p={isMobile ? 'md' : 'sm'}
              radius="lg"
              withBorder
              style={{
                background: `linear-gradient(135deg, ${theme.colors.slate[0]} 0%, ${theme.colors.ocean[0]} 100%)`,
                border: `1px solid ${theme.colors.slate[2]}`,
                transition: 'all 0.2s ease',
              }}
            >
              <Group gap="xs" mb="md">
                <IconCamera size={isMobile ? 20 : 18} color={theme.colors.ocean[6]} />
                <Title order={isMobile ? 4 : 5}>{t('step3_ccd_cameras')}</Title>
                <Badge variant="light" size={isMobile ? 'md' : 'sm'}>
                  2
                </Badge>
                {includesCcdPhone && (
                  <Badge color="green" size={isMobile ? 'md' : 'sm'}>
                    {t('step3_included')}
                  </Badge>
                )}
              </Group>

              <Stack gap="md">
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
            </Paper>

            {/* Phones */}
            <Paper
              p={isMobile ? 'md' : 'sm'}
              radius="lg"
              withBorder
              style={{
                background: `linear-gradient(135deg, ${theme.colors.slate[0]} 0%, ${theme.colors.emerald[0]} 100%)`,
                border: `1px solid ${theme.colors.slate[2]}`,
                transition: 'all 0.2s ease',
              }}
            >
              <Group gap="xs" mb="md">
                <IconDeviceMobile size={isMobile ? 20 : 18} color={theme.colors.emerald[6]} />
                <Title order={isMobile ? 4 : 5}>{t('step3_phones')}</Title>
                <Badge variant="light" size={isMobile ? 'md' : 'sm'}>
                  2
                </Badge>
                {includesCcdPhone && (
                  <Badge color="green" size={isMobile ? 'md' : 'sm'}>
                    {t('step3_included')}
                  </Badge>
                )}
              </Group>

              <Stack gap="md">
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
            </Paper>

            {/* DSLR */}
            <Paper
              p={isMobile ? 'md' : 'sm'}
              radius="lg"
              withBorder
              style={{
                background: `linear-gradient(135deg, ${theme.colors.slate[0]} 0%, ${theme.colors.rose[0]} 100%)`,
                border: `1px solid ${theme.colors.slate[2]}`,
                transition: 'all 0.2s ease',
              }}
            >
              <Group gap="xs" mb="md">
                <IconAperture size={isMobile ? 20 : 18} color={theme.colors.rose[6]} />
                <Title order={isMobile ? 4 : 5}>{t('step3_dslr')}</Title>
                <Badge variant="light" size={isMobile ? 'md' : 'sm'}>
                  1
                </Badge>
                {isQuebecCity && (
                  <Badge color="red" size={isMobile ? 'md' : 'sm'}>
                    {t('step3_required_qc')}
                  </Badge>
                )}
              </Group>

              <EquipSwitch
                title={t('step3_nikon_title')}
                readOnly={isQuebecCity || _loading}
                disabled={_loading}
                {...form.getInputProps('equipNikonDslr', { type: 'checkbox' })}
              />

              {dslrAsAddon && !includesCcdPhone && (
                <Box
                  mt="md"
                  p="sm"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.rose[1]} 0%, ${theme.colors.ocean[1]} 100%)`,
                    borderRadius: rem(8),
                    border: `1px solid ${theme.colors.rose[2]}`,
                  }}
                >
                  <NumberInput
                    label={t('step3_dslr_addon_label')}
                    description={t('step3_dslr_addon_desc')}
                    min={3}
                    step={1}
                    hideControls={false}
                    allowNegative={false}
                    clampBehavior="strict"
                    disabled={_loading}
                    size={isMobile ? 'md' : 'sm'}
                    {...form.getInputProps('dslrAddonPhotos')}
                  />
                </Box>
              )}
            </Paper>

            {/* Status Alerts */}
            <Transition mounted transition="slide-up" duration={300}>
              {(alertStyles) => (
                <Box style={alertStyles}>
                  {isQuebecCity ? (
                    <Alert color="red" icon={<IconInfoCircle size={16} />} radius="lg">
                      <Text size={isMobile ? 'sm' : 'xs'}>
                        <b>{t('step3_nikon_title')}</b> {t('step3_alert_qc')}{' '}
                        <b>{t('step2_quebec_city')}</b>.
                      </Text>
                    </Alert>
                  ) : includesCcdPhone ? (
                    <Alert color="green" icon={<IconCheck size={16} />} radius="lg">
                      <Text size={isMobile ? 'sm' : 'xs'}>
                        <b>{t('step3_ccd_phone')}</b> {t('step3_alert_included')} <b>2h+</b>{' '}
                        <b>{t('step3_nikon_title')}</b>.
                      </Text>
                    </Alert>
                  ) : dslrExclusive ? (
                    <Alert color="yellow" icon={<IconX size={16} />} radius="lg">
                      <Text size={isMobile ? 'sm' : 'xs'}>
                        <b>{t('step3_dslr')}</b> {t('step3_alert_dslr_exclusive')}
                      </Text>
                    </Alert>
                  ) : (
                    <Box
                      p="md"
                      style={{
                        background: `linear-gradient(135deg, ${theme.colors.slate[1]} 0%, ${theme.colors.emerald[1]} 100%)`,
                        borderRadius: rem(12),
                        border: `1px solid ${theme.colors.slate[2]}`,
                      }}
                    >
                      <Group gap="xs" mb="xs">
                        <IconSparkles size={16} color={theme.colors.emerald[6]} />
                        <Text size="xs" fw={600} c="emerald">
                          {t('step3_alert_select')}
                        </Text>
                      </Group>
                      <Text size={isMobile ? 'sm' : 'xs'} c="dimmed">
                        <b>{t('step3_ccd_phone')}</b>. {t('step3_alert_add')}{' '}
                        <b>{t('step3_dslr_photos')}</b> {t('step3_alert_addon')}
                      </Text>
                    </Box>
                  )}
                </Box>
              )}
            </Transition>
          </Stack>
        </Box>
      )}
    </Transition>
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
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Paper
      p="sm"
      radius="md"
      withBorder
      style={{
        background: `linear-gradient(135deg, ${theme.colors.slate[0]} 0%, ${theme.colors.slate[1]} 100%)`,
        border: `1px solid ${theme.colors.slate[2]}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: `0 2px 8px ${theme.colors.slate[2]}`,
        },
      }}
    >
      <Switch
        size={isMobile ? 'lg' : 'md'}
        label={title}
        description={note}
        styles={(theme) => ({
          body: {
            alignItems: 'flex-start',
            gap: isMobile ? rem(12) : rem(8),
          },
          label: {
            fontWeight: 600,
            lineHeight: 1.2,
            fontSize: isMobile ? rem(14) : rem(12),
          },
          description: {
            lineHeight: 1.3,
            marginTop: rem(4),
            color: theme.colors.gray[6],
            fontSize: isMobile ? rem(12) : rem(11),
          },
          track: {
            transition: 'all 0.2s ease',
            '&[dataChecked]': {
              background: `linear-gradient(135deg, ${theme.colors.ocean[6]} 0%, ${theme.colors.emerald[6]} 100%)`,
            },
          },
          thumb: {
            transition: 'all 0.2s ease',
            '&[dataChecked]': {
              background: theme.colors.white,
              boxShadow: `0 2px 4px ${theme.colors.slate[3]}`,
            },
          },
        })}
        {...rest}
      />
    </Paper>
  );
}
