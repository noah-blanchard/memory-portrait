'use client';

import { useEffect, useState } from 'react';
import { IconBrandInstagram, IconBrandWechat, IconUser } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  NativeSelect,
  Paper,
  Stack,
  Text,
  TextInput,
  Transition,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import type { BookingStepProps, ContactMethod } from '@/types/components';

export interface Step1ContactValues {
  clientName: string;
  contactMethod: ContactMethod;
  contact: string;
}

export interface Step1ContactProps extends Omit<BookingStepProps, 'onBack'> {
  // Step 1 doesn't have a back button
}

const methodIcon = (method: ContactMethod, size = 16) => {
  switch (method) {
    case 'wechat':
      return <IconBrandWechat size={size} />;
    case 'instagram':
      return <IconBrandInstagram size={size} />;
    case 'email':
      return <IconUser size={size} />; // Using User icon for email as fallback
    case 'phone':
      return <IconUser size={size} />; // Using User icon for phone as fallback
    default:
      return <IconUser size={size} />;
  }
};

export default function Step1Contact({
  form,
  onNext: _onNext,
  loading: _loading = false,
}: Step1ContactProps) {
  const { t } = useTranslation('common');
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const placeholderByMethod: Record<ContactMethod, string> = {
    wechat: t('step1_wechat_placeholder'),
    instagram: t('step1_instagram_placeholder'),
    email: 'email@example.com',
    phone: '+1234567890',
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
                    placeholder={placeholderByMethod[form.values.contactMethod as ContactMethod]}
                    withAsterisk
                    size={isMobile ? 'md' : 'sm'}
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
