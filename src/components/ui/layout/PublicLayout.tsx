'use client';

import { Box, useMantineTheme } from '@mantine/core';
import { getGradient } from '@/utils/theme';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const theme = useMantineTheme();
  
  return (
    <Box
      component="main"
      style={{
        minHeight: '100dvh',
        width: '100%',
        background: getGradient(theme, 'background'),
      }}
    >
      {children}
    </Box>
  );
}
