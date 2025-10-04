'use client';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import { ensureI18n } from '@/lib/i18n';
import { theme } from '@/theme';
import QueryProvider from '@/lib/providers/QueryProvider';

ensureI18n();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
      <MantineProvider theme={theme} defaultColorScheme="light">
        <DatesProvider settings={{ locale: 'en', firstDayOfWeek: 1 }}>
          <Notifications position="top-right" />
          <QueryProvider>
            {children}
          </QueryProvider>
        </DatesProvider>
      </MantineProvider>
    </>
  );
}
