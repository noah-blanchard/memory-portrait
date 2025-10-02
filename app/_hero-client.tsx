'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTransition } from '@/hooks/usePageTransition';
import { 
  IconBrandInstagram, 
  IconBrandWechat, 
  IconCamera, 
  IconCheck
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
  Divider
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Badge, Button, Text, Title, Tooltip } from '@/components/I18nUI/I18nUI';

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
    <Box component="section" py={{ base: 32, sm: 48, md: 64 }}>
      <Container size="sm">
        {/* Language Switcher - Top Right */}
        <Flex justify="flex-end" mb={{ base: 24, sm: 32 }}>
          <Group gap={4} p={4} style={{ 
            backgroundColor: 'var(--mantine-color-gray-0)', 
            borderRadius: '12px',
            border: '1px solid var(--mantine-color-gray-2)'
          }}>
            <UnstyledButton
              onClick={() => switchLanguage('en')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                backgroundColor: currentLang === 'en' ? 'var(--mantine-color-ocean-5)' : 'transparent',
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
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                backgroundColor: currentLang === 'zh' ? 'var(--mantine-color-ocean-5)' : 'transparent',
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
        <Stack gap={isMobile ? 24 : 32} align="center">
          {/* Brand Badge */}
          <Badge
            size={isMobile ? 'lg' : 'xl'}
            variant="light"
            color="ocean"
            leftSection={<IconCamera size={isMobile ? 16 : 18} />}
            styles={{ 
              root: { 
                fontWeight: 700, 
                letterSpacing: 0.5
              } 
            }}
          >
            brand_name
          </Badge>

          {/* Main Title */}
          <Title 
            order={1} 
            ta="center" 
            fz={{ base: 32, sm: 42, md: 48 }}
            style={{ 
              lineHeight: 1.1,
              maxWidth: '100%'
            }}
          >
            <Text
              component="span"
              variant="gradient"
              gradient={{ from: 'ocean.6', to: 'emerald.5', deg: 45 }}
              inherit
              fw={800}
            >
              welcome_title
            </Text>
          </Title>

          {/* Tagline */}
          <Text 
            ta="center" 
            c="dimmed" 
            maw={600} 
            fz={{ base: 'lg', sm: 'xl' }}
            lh={1.4}
            px={{ base: 16, sm: 0 }}
          >
            welcome_tagline
          </Text>

          {/* CTA Button */}
          <Button
            onClick={(e) => navigateWithTransition('/booking', e)}
            size={isMobile ? 'lg' : 'xl'}
            radius="xl"
            color="ocean"
            px={{ base: 32, sm: 48 }}
            py={{ base: 12, sm: 16 }}
            w={{ base: '100%', sm: 'auto' }}
            maw={400}
            leftSection={<IconCamera size={isMobile ? 18 : 22} />}
            styles={{
              root: {
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 600,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.16)',
                }
              }
            }}
          >
            cta_request
          </Button>
        </Stack>

        {/* Social Media Section */}
        <Box mt={{ base: 48, sm: 64 }}>
          <Center mb={{ base: 24, sm: 32 }}>
            <Group gap="sm">
              <Divider w={40} color="gray.3" />
              <Text fz="sm" fw={600} c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>
                socials
              </Text>
              <Divider w={40} color="gray.3" />
            </Group>
          </Center>

          <Stack gap={isMobile ? 12 : 16} maw={480} mx="auto">
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
                      padding: isMobile ? '16px 20px' : '18px 24px',
                      borderRadius: '16px',
                      background: copied 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: isMobile ? '15px' : '16px',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s ease',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!copied) {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <Flex align="center" justify="center" gap="sm">
                      {copied ? (
                        <IconCheck size={isMobile ? 18 : 20} />
                      ) : (
                        <IconBrandInstagram size={isMobile ? 18 : 20} />
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
                      padding: isMobile ? '16px 20px' : '18px 24px',
                      borderRadius: '16px',
                      background: copied 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: isMobile ? '15px' : '16px',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s ease',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!copied) {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <Flex align="center" justify="center" gap="sm">
                      {copied ? (
                        <IconCheck size={isMobile ? 18 : 20} />
                      ) : (
                        <IconBrandWechat size={isMobile ? 18 : 20} />
                      )}
                      <Text inherit>
                        {copied ? t('copied') : 'Missnnuu'}
                      </Text>
                    </Flex>
                  </UnstyledButton>
                </Tooltip>
              )}
            </CopyButton>
          </Stack>

          {/* Social Tip */}
          <Center mt={{ base: 24, sm: 32 }}>
            <Text 
              fz="sm" 
              ta="center" 
              c="dimmed"
              maw={400}
              px={{ base: 16, sm: 0 }}
            >
              social_tip
            </Text>
          </Center>
        </Box>
      </Container>
    </Box>
  );
}
