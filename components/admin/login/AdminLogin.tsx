'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Button,
  Center,
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { createClient } from '@/utils/supabase/client';

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Invalid email'),
      password: (v) => (v.length >= 6 ? null : 'Password must be at least 6 characters'),
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
      // redirect vers le dashboard admin (adapte la route)
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
              Admin login
            </Title>
            <Text c="dimmed" size="sm" ta="center">
              Please sign in with your admin credentials.
            </Text>

            {serverError && (
              <Alert
                variant="light"
                color="red"
                icon={<IconAlertCircle size={16} />}
                title="Authentication failed"
              >
                {serverError}
              </Alert>
            )}

            <form onSubmit={onSubmit}>
              <Stack gap="sm">
                <TextInput
                  label="Email"
                  placeholder="admin@example.com"
                  withAsterisk
                  type="email"
                  autoComplete="email"
                  {...form.getInputProps('email')}
                />
                <PasswordInput
                  label="Password"
                  placeholder="••••••••"
                  withAsterisk
                  autoComplete="current-password"
                  {...form.getInputProps('password')}
                />

                <Group justify="center" mt="sm">
                  <Button type="submit" loading={loading} radius="md" fullWidth>
                    Sign in
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
