'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTransition } from '@/hooks/usePageTransition';
import { 
  IconBrandInstagram, 
  IconBrandWechat, 
  IconCamera, 
  IconCheck,
  IconSparkles,
  IconHeart,
  IconStar,
  IconArrowRight,
  IconPalette
} from '@tabler/icons-react';
import { 
  Box, 
  Container, 
  CopyButton, 
  Group, 
  Stack, 
  UnstyledButton,
  Flex,
  Center,
  Paper,
  SimpleGrid,
  ThemeIcon
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Badge, Button, Text, Title, Tooltip } from '@/components/common/i18n';

export default function HeroClient() {
  const { t, i18n } = useTranslation('common');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [currentLang, setCurrentLang] = useState<'en' | 'zh'>('en');
  const { navigateWithTransition } = usePageTransition();

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
      component="section" 
      style={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.05) 0%, rgba(251, 191, 36, 0.08) 25%, rgba(239, 68, 68, 0.05) 50%, rgba(251, 146, 60, 0.08) 75%, rgba(244, 63, 94, 0.05) 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background decorative elements */}
      <Box
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-8%',
          width: isMobile ? '250px' : '350px',
          height: isMobile ? '250px' : '350px',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <Box
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: isMobile ? '200px' : '250px',
          height: isMobile ? '200px' : '250px',
          background: 'radial-gradient(circle, rgba(244, 63, 94, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

      <Container size="sm" style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: isMobile ? '20px' : '40px' }}>
        {/* Top Controls - Language Switcher & Admin Login */}
        <Flex justify="space-between" align="center">
          {/* Admin Login Button - Discreet */}
          <Button
            variant="subtle"
            size="xs"
            color="gray"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => navigateWithTransition('/admin-login', e)}
            style={{
              opacity: 0.6,
              fontSize: '10px',
              fontWeight: 500,
              padding: '3px 6px',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '1';
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '0.6';
            }}
          >
            Admin
          </Button>

          {/* Language Switcher */}
          <Group gap={2} p={2} style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          }}>
            <UnstyledButton
              onClick={() => switchLanguage('en')}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: currentLang === 'en' ? 'var(--mantine-color-rose-6)' : 'transparent',
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
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: currentLang === 'zh' ? 'var(--mantine-color-rose-6)' : 'transparent',
                color: currentLang === 'zh' ? '#fff' : 'var(--mantine-color-gray-7)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
            >
              中文
            </UnstyledButton>
          </Group>
        </Flex>

        {/* Main Hero Content */}
        <Stack gap={isMobile ? 12 : 16} align="center" style={{ flex: 1, justifyContent: 'center' }}>
          {/* Brand Badge */}
          <Badge
            size={isMobile ? 'md' : 'lg'}
            variant="light"
            color="rose"
            leftSection={<IconSparkles size={isMobile ? 12 : 14} />}
            styles={{ 
              root: { 
                fontWeight: 600, 
                letterSpacing: 0.3,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              } 
            }}
          >
            brand_name
          </Badge>

          {/* Main Title */}
          <Title 
            order={1} 
            ta="center" 
            fz={{ base: 24, sm: 28, md: 32 }}
            style={{ 
              lineHeight: 1.1,
              maxWidth: '100%'
            }}
          >
            <Text
              component="span"
              variant="gradient"
              gradient={{ from: 'rose.6', to: 'gold.6', deg: 45 }}
              inherit
              fw={700}
            >
              welcome_title
            </Text>
          </Title>

          {/* Tagline */}
          <Text 
            ta="center" 
            c="dimmed" 
            maw={500} 
            fz={{ base: 'sm', sm: 'md' }}
            lh={1.4}
            px={{ base: 16, sm: 0 }}
            style={{
              fontWeight: 500,
            }}
          >
            welcome_tagline
          </Text>

          {/* Feature Highlights */}
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xs" w="100%" maw={500}>
            <Paper
              p="sm"
              radius="md"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
              }}
            >
              <ThemeIcon size="sm" variant="light" color="rose" mb="xs" mx="auto">
                <IconHeart size={16} />
              </ThemeIcon>
              <Text fw={600} size="xs" mb={2}>Passionate</Text>
              <Text size="xs" c="dimmed">Authentic moments</Text>
            </Paper>

            <Paper
              p="sm"
              radius="md"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
              }}
            >
              <ThemeIcon size="sm" variant="light" color="gold" mb="xs" mx="auto">
                <IconStar size={16} />
              </ThemeIcon>
              <Text fw={600} size="xs" mb={2}>Professional</Text>
              <Text size="xs" c="dimmed">High-quality</Text>
            </Paper>

            <Paper
              p="sm"
              radius="md"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
              }}
            >
              <ThemeIcon size="sm" variant="light" color="orange" mb="xs" mx="auto">
                <IconPalette size={16} />
              </ThemeIcon>
              <Text fw={600} size="xs" mb={2}>Creative</Text>
              <Text size="xs" c="dimmed">Unique style</Text>
            </Paper>
          </SimpleGrid>

          {/* CTA Button */}
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => navigateWithTransition('/booking', e)}
            size={isMobile ? 'md' : 'lg'}
            radius="md"
            px={{ base: 24, sm: 32 }}
            py={{ base: 8, sm: 12 }}
            w={{ base: '100%', sm: 'auto' }}
            maw={300}
            leftSection={<IconCamera size={isMobile ? 14 : 16} />}
            rightSection={<IconArrowRight size={isMobile ? 12 : 14} />}
            styles={{
              root: {
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: 600,
                background: 'linear-gradient(135deg, var(--mantine-color-rose-6) 0%, var(--mantine-color-gold-6) 100%)',
                border: 'none',
                boxShadow: '0 4px 16px rgba(244, 63, 94, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(244, 63, 94, 0.4)',
                  background: 'linear-gradient(135deg, var(--mantine-color-rose-7) 0%, var(--mantine-color-gold-7) 100%)',
                }
              }
            }}
          >
            cta_request
          </Button>
        </Stack>

        {/* Social Media Section */}
        <Box>
          <Center mb="xs">
            <Text fz="xs" fw={600} c="dimmed" tt="uppercase" style={{ letterSpacing: 0.5 }}>
              Connect With Us
            </Text>
          </Center>

          <SimpleGrid cols={2} spacing="xs" maw={300} mx="auto">
            {/* Instagram */}
            <CopyButton value="memory_portrait" timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip 
                  label={copied ? t('copied') : t('copy_handle')} 
                  withArrow
                  position="top"
                >
                  <UnstyledButton
                    onClick={copy}
                    w="100%"
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: copied 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '11px',
                      boxShadow: '0 2px 8px rgba(236, 72, 153, 0.3)',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!copied) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(236, 72, 153, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(236, 72, 153, 0.3)';
                    }}
                  >
                    <Flex align="center" justify="center" gap="xs">
                      {copied ? (
                        <IconCheck size={10} />
                      ) : (
                        <IconBrandInstagram size={10} />
                      )}
                      <Text inherit>
                        {copied ? t('copied') : '@memory_portrait'}
                      </Text>
                    </Flex>
                  </UnstyledButton>
                </Tooltip>
              )}
            </CopyButton>

            {/* WeChat */}
            <CopyButton value="Missnnuu" timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip 
                  label={copied ? t('copied') : t('copy_id')} 
                  withArrow
                  position="top"
                >
                  <UnstyledButton
                    onClick={copy}
                    w="100%"
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: copied 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '11px',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!copied) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(16, 185, 129, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.3)';
                    }}
                  >
                    <Flex align="center" justify="center" gap="xs">
                      {copied ? (
                        <IconCheck size={10} />
                      ) : (
                        <IconBrandWechat size={10} />
                      )}
                      <Text inherit>
                        {copied ? t('copied') : 'Missnnuu'}
                      </Text>
                    </Flex>
                  </UnstyledButton>
                </Tooltip>
              )}
            </CopyButton>
          </SimpleGrid>

          {/* Social Tip */}
          <Center mt="xs">
            <Text 
              fz="xs" 
              ta="center" 
              c="dimmed"
              maw={250}
              px={{ base: 16, sm: 0 }}
              style={{
                fontWeight: 500,
              }}
            >
              social_tip
            </Text>
          </Center>
        </Box>
      </Container>
    </Box>
  );
}
