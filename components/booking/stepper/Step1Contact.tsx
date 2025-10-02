'use client';

import { useEffect, useState } from 'react';
import { IconBrandInstagram, IconBrandWechat, IconUser } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  NativeSelect,
  Paper,
  rem,
  Stack,
  Text,
  TextInput,
  Transition,
  useMantineTheme,
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';

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
  onNext: _onNext,
}: {
  form: UseFormReturnType<any>;
  onNext: () => void;
}) {
  const { t } = useTranslation('common');
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const placeholderByMethod: Record<Step1Values['contactMethod'], string> = {
    wechat: t('step1_wechat_placeholder'),
    instagram: t('step1_instagram_placeholder'),
  };

  return (
    <Transition mounted={mounted} transition="fade" duration={400}>
      {(styles) => (
        <Box style={styles}>
          <Stack gap={isMobile ? 'lg' : 'md'}>
            {/* Welcome Header */}
            <Box ta="center" mb="xs">
              <Text size={isMobile ? 'sm' : 'md'} fw={600} c="dimmed">
                {t('welcome_title')}
              </Text>
              <Text size="xs" c="dimmed" mt={2}>
                {t('welcome_tagline')}
              </Text>
            </Box>

            {/* Name Input */}
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
              <TextInput
                label={t('step1_name_label')}
                placeholder={t('step1_name_placeholder')}
                withAsterisk
                leftSection={<IconUser size={isMobile ? 18 : 16} />}
                size={isMobile ? 'md' : 'sm'}
                styles={{
                  input: {
                    fontSize: isMobile ? rem(16) : rem(14),
                    padding: isMobile ? rem(12) : rem(10),
                    paddingLeft: isMobile ? rem(36) : rem(32),
                    borderRadius: rem(12),
                    border: `2px solid ${theme.colors.slate[2]}`,
                    transition: 'all 0.2s ease',
                    '&:focus': {
                      borderColor: theme.colors.ocean[4],
                      boxShadow: `0 0 0 3px ${theme.colors.ocean[1]}`,
                      transform: 'translateY(-1px)',
                    },
                  },
                  label: {
                    fontSize: isMobile ? rem(14) : rem(12),
                    fontWeight: 600,
                    marginBottom: rem(8),
                  },
                }}
                {...form.getInputProps('clientName')}
              />
            </Paper>

            {/* Contact Method Selection */}
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
              <NativeSelect
                withAsterisk
                label={t('step1_contact_label')}
                leftSection={methodIcon(form.values.contactMethod, isMobile ? 18 : 16)}
                data={[
                  { value: 'wechat', label: t('step1_wechat') },
                  { value: 'instagram', label: t('step1_instagram') },
                ]}
                size={isMobile ? 'md' : 'sm'}
                {...form.getInputProps('contactMethod')}
                styles={{
                  input: {
                    fontSize: isMobile ? rem(16) : rem(14),
                    padding: isMobile ? rem(12) : rem(10),
                    paddingLeft: isMobile ? rem(36) : rem(32),
                    borderRadius: rem(12),
                    border: `2px solid ${theme.colors.slate[2]}`,
                    transition: 'all 0.2s ease',
                    color: theme.colors.dark[7],
                    backgroundColor: '#ffffff',
                    '&:focus': {
                      borderColor: theme.colors.emerald[4],
                      boxShadow: `0 0 0 3px ${theme.colors.emerald[1]}`,
                      transform: 'translateY(-1px)',
                    },
                    '&:not([dataPlaceholder])': {
                      color: theme.colors.dark[7],
                    },
                  },
                  label: {
                    fontSize: isMobile ? rem(14) : rem(12),
                    fontWeight: 600,
                    marginBottom: rem(8),
                  },
                }}
              />
            </Paper>

            {/* Contact Input */}
            <Transition mounted transition="slide-down" duration={300} timingFunction="ease-out">
              {(contactStyles) => (
                <Paper
                  p={isMobile ? 'md' : 'sm'}
                  radius="lg"
                  withBorder
                  style={{
                    ...contactStyles,
                    background: `linear-gradient(135deg, ${theme.colors.slate[0]} 0%, ${theme.colors.rose[0]} 100%)`,
                    border: `1px solid ${theme.colors.slate[2]}`,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <TextInput
                    label={t('step1_contact_label')}
                    leftSection={methodIcon(form.values.contactMethod, isMobile ? 18 : 16)}
                    placeholder={placeholderByMethod[form.values.contactMethod]}
                    withAsterisk
                    size={isMobile ? 'md' : 'sm'}
                    styles={{
                      input: {
                        fontSize: isMobile ? rem(16) : rem(14),
                        padding: isMobile ? rem(12) : rem(10),
                        paddingLeft: isMobile ? rem(36) : rem(32),
                        borderRadius: rem(12),
                        border: `2px solid ${theme.colors.slate[2]}`,
                        transition: 'all 0.2s ease',
                        '&:focus': {
                          borderColor: theme.colors.rose[4],
                          boxShadow: `0 0 0 3px ${theme.colors.rose[1]}`,
                          transform: 'translateY(-1px)',
                        },
                      },
                    }}
                    {...form.getInputProps('contact')}
                  />
                </Paper>
              )}
            </Transition>
          </Stack>
        </Box>
      )}
    </Transition>
  );
}
