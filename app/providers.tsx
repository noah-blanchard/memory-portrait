'use client';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; // ⬅️ nouveau

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { theme } from '@/theme';
import { ensureI18n } from '@/lib/i18n';

ensureI18n();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
      <MantineProvider theme={theme} defaultColorScheme="light">
        <DatesProvider settings={{ locale: 'en', firstDayOfWeek: 1 }}>{children}</DatesProvider>
      </MantineProvider>
    </>
  );
}
