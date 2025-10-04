import type { Metadata, Viewport } from 'next';
import Providers from './providers';
import { PageTransition } from '@/components/common/transitions';

export const metadata: Metadata = {
  title: 'Memory Portrait',
  description: 'Memory Portrait Booking App',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0 }}>
        <Providers>
          <PageTransition>
            {children}
          </PageTransition>
        </Providers>
      </body>
    </html>
  );
}
