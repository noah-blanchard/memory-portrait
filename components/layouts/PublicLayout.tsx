'use client';

import { useEffect, useState } from 'react';
import { Box, Card, Center, Group, Text, UnstyledButton } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const GAP = 'clamp(12px, 4vw, 28px)';
  const CARD_PAD = 'clamp(16px, 4vw, 32px)';
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState<'en' | 'zh'>('en');

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && (localStorage.getItem('lang') as 'en' | 'zh')) || null;
    const initial = saved ?? (i18n.language?.startsWith('zh') ? 'zh' : 'en');
    setCurrentLang(initial);
    i18n.changeLanguage(initial);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = initial;
    }
  }, [i18n]);

  const switchLanguage = (lang: 'en' | 'zh') => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
  };

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
          borderColor: 'var(--mantine-color-slate-2)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(52,211,153,0.08))',
          }}
        />

        <Box
          style={{ 
            position: 'relative', 
            zIndex: 1, 
            overflow: 'auto', 
            scrollbarGutter: 'stable',
            flex: 1,
          }}
        >
          {children}
        </Box>

        <Box
          style={{ 
            position: 'relative', 
            zIndex: 1,
            marginTop: '1rem',
          }}
        >
          <Center>
            <Group gap="xs">
              <Text size="xs" c="dimmed">Language:</Text>
              <Group gap={4}>
                <UnstyledButton
                  onClick={() => switchLanguage('en')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: currentLang === 'en' ? 'var(--mantine-color-ocean-5)' : 'var(--mantine-color-gray-1)',
                    color: currentLang === 'en' ? '#fff' : 'var(--mantine-color-gray-7)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                >
                  EN
                </UnstyledButton>
                <UnstyledButton
                  onClick={() => switchLanguage('zh')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: currentLang === 'zh' ? 'var(--mantine-color-ocean-5)' : 'var(--mantine-color-gray-1)',
                    color: currentLang === 'zh' ? '#fff' : 'var(--mantine-color-gray-7)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                >
                  中文
                </UnstyledButton>
              </Group>
            </Group>
          </Center>
        </Box>
      </Card>
    </Box>
  );
}
