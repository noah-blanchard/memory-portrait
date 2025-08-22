// src/components/PublicLayout.tsx
'use client';

import { Box, Card } from '@mantine/core';
import LanguageSwitch from '../language/LanguageSwitch';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const GAP = 'clamp(12px, 4vw, 28px)';
  const CARD_PAD = 'clamp(16px, 4vw, 32px)';

  return (
    <Box
      component="main"
      style={{
        minHeight: '100dvh',
        width: '100%',
        paddingTop: `calc(${GAP} + env(safe-area-inset-top))`,
        paddingBottom: `calc(${GAP} + env(safe-area-inset-bottom))`,
        paddingLeft: `calc(${GAP} + env(safe-area-inset-left))`,
        paddingRight: `calc(${GAP} + env(safe-area-inset-right))`,
        display: 'grid',
      }}
    >
      <Card
        withBorder
        radius="xl"
        style={{
          height: '100%',
          width: '100%',
          padding: CARD_PAD,
          background: '#fff',
          borderColor: 'var(--mantine-color-mist-2)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          position: 'relative', // <-- pour positionner le switch "absolute" dessus
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Overlay gradient sous le contenu */}
        <Box
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            background: 'linear-gradient(135deg, rgba(70,162,255,0.12), rgba(255,195,61,0.12))',
          }}
        />

        {/* Contenu */}
        <Box
          style={{ position: 'relative', zIndex: 1, overflow: 'auto', scrollbarGutter: 'stable' }}
        >
          {children}
        </Box>
      </Card>
    </Box>
  );
}
