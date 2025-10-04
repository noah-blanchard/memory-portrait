'use client';

import { Box } from '@mantine/core';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      component="main"
      style={{
        minHeight: '100dvh',
        width: '100%',
        background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(52,211,153,0.08))',
      }}
    >
      {children}
    </Box>
  );
}
