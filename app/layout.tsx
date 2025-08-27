import type { Metadata, Viewport } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Memory Portrait',
  description: 'Memory Portrait Booking App',
  // viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};  

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
