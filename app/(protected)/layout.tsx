// app/(admin)/layout.tsx
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/utils/supabase/server';
import { Container } from '@mantine/core';

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
      px="lg"      // horizontal padding
      py="lg"      // vertical padding
      // keeps nice spacing on iOS safe areas too:
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
