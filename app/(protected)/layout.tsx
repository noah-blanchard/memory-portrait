import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Container } from '@mantine/core';
import { createServerClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect('/');
  }

  return (
    <Container
      fluid
      px="lg"
      py="lg"
      style={{
        paddingLeft: 'calc(var(--mantine-spacing-lg) + env(safe-area-inset-left))',
        paddingRight: 'calc(var(--mantine-spacing-lg) + env(safe-area-inset-right))',
        paddingTop: 'calc(var(--mantine-spacing-lg) + env(safe-area-inset-top))',
        paddingBottom: 'calc(var(--mantine-spacing-lg) + env(safe-area-inset-bottom))',
      }}
    >
      {children}
    </Container>
  );
}
