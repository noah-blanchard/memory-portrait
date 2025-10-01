'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Center,
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { Alert, Button, Text, Title } from '@/components/I18nUI/I18nUI';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { createClient } from '@/utils/supabase/client';
import { useTranslation } from 'react-i18next';

export default function AdminLogin() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : t('admin_invalid_email')),
      password: (v) => (v.length >= 6 ? null : t('admin_password_min')),
    },
  });

  const onSubmit = form.onSubmit(async ({ email, password }) => {
    setServerError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setServerError(error.message);
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch (e: any) {
      setServerError(e?.message ?? 'Unexpected error');
    } finally {
      setLoading(false);
    }
  });

  return (
    <Center>
      <Container size={420} p={0}>
        <Paper withBorder shadow="sm" radius="lg" p="xl">
          <Stack gap="md">
            <Title order={3} ta="center">
              admin_login_title
            </Title>
            <Text c="dimmed" size="sm" ta="center">
              admin_login_subtitle
            </Text>

            {serverError && (
              <Alert
                variant="light"
                color="red"
                icon={<IconAlertCircle size={16} />}
                title="admin_auth_failed"
              >
                {serverError}
              </Alert>
            )}

            <form onSubmit={onSubmit}>
              <Stack gap="sm">
                <TextInput
                  label={t('admin_email')}
                  placeholder={t('admin_email_placeholder')}
                  withAsterisk
                  type="email"
                  autoComplete="email"
                  {...form.getInputProps('email')}
                />
                <PasswordInput
                  label={t('admin_password')}
                  placeholder={t('admin_password_placeholder')}
                  withAsterisk
                  autoComplete="current-password"
                  {...form.getInputProps('password')}
                />

                <Group justify="center" mt="sm">
                  <Button type="submit" loading={loading} radius="md" fullWidth>
                    common_sign_in
                  </Button>
                </Group>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Container>
    </Center>
  );
}
