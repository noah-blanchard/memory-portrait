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
  ThemeIcon,
  useMantineTheme
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Badge, Button, Text, Title, Tooltip } from '@/components/common/i18n';

/**
 * Hero Client Component
 * 
 * Main landing page component featuring:
 * - Language switcher (EN/ZH)
 * - Feature showcase cards
 * - Call-to-action button for booking
 * - Social media contact buttons
 * - Responsive design for mobile and desktop
 * 
 * @returns {JSX.Element} The hero client component
 */
export default function HeroClient() {
  const { t, i18n } = useTranslation('common');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [currentLang, setCurrentLang] = useState<'en' | 'zh'>('en');
  const { navigateWithTransition } = usePageTransition();
  const theme = useMantineTheme();

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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: `linear-gradient(135deg, ${theme.colors.rose[0]} 0%, ${theme.colors.gold[0]} 25%, ${theme.colors.rose[0]} 50%, ${theme.colors.gold[0]} 75%, ${theme.colors.rose[0]} 100%)`,
        overflow: 'auto',
        zIndex: 1000,
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
          background: `radial-gradient(circle, ${theme.colors.gold[1]} 0%, transparent 70%)`,
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
          background: `radial-gradient(circle, ${theme.colors.rose[1]} 0%, transparent 70%)`,
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

      {/* Main content container */}
      <Box
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: isMobile ? theme.spacing.lg : theme.spacing.xl,
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
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
            backgroundColor: `${theme.white}CC`, 
            borderRadius: theme.radius.sm,
            border: `1px solid ${theme.colors.slate[1]}`,
            backdropFilter: 'blur(10px)',
          }}>
            <UnstyledButton
              onClick={() => switchLanguage('en')}
              style={{
                padding: '4px 8px',
                borderRadius: theme.radius.xs,
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: currentLang === 'en' ? theme.colors.rose[6] : 'transparent',
                color: currentLang === 'en' ? theme.white : theme.colors.slate[6],
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
                borderRadius: theme.radius.xs,
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: currentLang === 'zh' ? theme.colors.rose[6] : 'transparent',
                color: currentLang === 'zh' ? theme.white : theme.colors.slate[6],
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
            >
              中文
            </UnstyledButton>
          </Group>
        </Flex>

        {/* Main Hero Content */}
        <Stack gap={isMobile ? theme.spacing.xs : theme.spacing.md} align="center" style={{ flex: 1, justifyContent: 'center' }}>
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
            fz={{ base: 22, sm: 26, md: 30 }}
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
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={isMobile ? "xs" : "sm"} w="100%" maw={isMobile ? 400 : 500}>
            <Paper
              p={isMobile ? "xs" : "sm"}
              radius="md"
              style={{
                background: `${theme.white}CC`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.colors.slate[1]}`,
                textAlign: 'center',
              }}
            >
              <ThemeIcon size={isMobile ? "xs" : "sm"} variant="light" color="rose" mb={isMobile ? 2 : "xs"} mx="auto">
                <IconHeart size={isMobile ? 12 : 16} />
              </ThemeIcon>
              <Text fw={600} size={isMobile ? "xs" : "xs"} mb={isMobile ? 1 : 2}>Passionate</Text>
              <Text size={isMobile ? "xs" : "xs"} c="dimmed">Authentic moments</Text>
            </Paper>

            <Paper
              p={isMobile ? "xs" : "sm"}
              radius="md"
              style={{
                background: `${theme.white}CC`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.colors.slate[1]}`,
                textAlign: 'center',
              }}
            >
              <ThemeIcon size={isMobile ? "xs" : "sm"} variant="light" color="gold" mb={isMobile ? 2 : "xs"} mx="auto">
                <IconStar size={isMobile ? 12 : 16} />
              </ThemeIcon>
              <Text fw={600} size={isMobile ? "xs" : "xs"} mb={isMobile ? 1 : 2}>Professional</Text>
              <Text size={isMobile ? "xs" : "xs"} c="dimmed">High-quality</Text>
            </Paper>

            <Paper
              p={isMobile ? "xs" : "sm"}
              radius="md"
              style={{
                background: `${theme.white}CC`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.colors.slate[1]}`,
                textAlign: 'center',
              }}
            >
              <ThemeIcon size={isMobile ? "xs" : "sm"} variant="light" color="orange" mb={isMobile ? 2 : "xs"} mx="auto">
                <IconPalette size={isMobile ? 12 : 16} />
              </ThemeIcon>
              <Text fw={600} size={isMobile ? "xs" : "xs"} mb={isMobile ? 1 : 2}>Creative</Text>
              <Text size={isMobile ? "xs" : "xs"} c="dimmed">Unique style</Text>
            </Paper>
          </SimpleGrid>

          {/* CTA Button - Main Element */}
          <Box style={{ margin: isMobile ? `${theme.spacing.lg} 0` : `${theme.spacing.xl} 0` }}>
            <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => navigateWithTransition('/booking', e)}
            size={isMobile ? 'xl' : 'xl'}
            radius="xl"
            px={{ base: 40, sm: 60 }}
            py={{ base: 16, sm: 20 }}
            w={{ base: '100%', sm: 'auto' }}
            maw={isMobile ? 350 : 450}
            leftSection={<IconCamera size={isMobile ? 20 : 24} />}
            rightSection={<IconArrowRight size={isMobile ? 18 : 22} />}
            styles={{
              root: {
                fontSize: isMobile ? '12px' : '12px',
                fontWeight: 800,
                background: `linear-gradient(${theme.defaultGradient.deg}deg, ${theme.colors[theme.defaultGradient.from.split('.')[0]][parseInt(theme.defaultGradient.from.split('.')[1])]} 0%, ${theme.colors[theme.defaultGradient.to.split('.')[0]][parseInt(theme.defaultGradient.to.split('.')[1])]} 100%)`,
                border: 'none',
                boxShadow: `0 8px 32px ${theme.colors.rose[6]}66`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 40px ${theme.colors.rose[6]}80`,
                  background: `linear-gradient(${theme.defaultGradient.deg}deg, ${theme.colors[theme.defaultGradient.from.split('.')[0]][parseInt(theme.defaultGradient.from.split('.')[1]) + 1]} 0%, ${theme.colors[theme.defaultGradient.to.split('.')[0]][parseInt(theme.defaultGradient.to.split('.')[1]) + 1]} 100%)`,
                }
              }
            }}
          >
            cta_request
          </Button>
          </Box>
        </Stack>

        {/* Social Media Section */}
        <Box style={{ padding: isMobile ? theme.spacing.sm : theme.spacing.lg }}>
          <Center mb={isMobile ? theme.spacing.sm : theme.spacing.md}>
            <Group align="center" gap="md">
              <Box
                style={{
                  height: '1px',
                  width: isMobile ? '40px' : '60px',
                  background: `linear-gradient(90deg, transparent, ${theme.colors.slate[4]}, transparent)`,
                }}
              />
              <Text fz={isMobile ? "sm" : "md"} fw={700} c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>
                Socials
              </Text>
              <Box
                style={{
                  height: '1px',
                  width: isMobile ? '40px' : '60px',
                  background: `linear-gradient(90deg, transparent, ${theme.colors.slate[4]}, transparent)`,
                }}
              />
            </Group>
          </Center>

          <SimpleGrid cols={2} spacing="md" maw={isMobile ? 320 : 400} mx="auto">
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
                      padding: isMobile ? '12px 16px' : '16px 20px',
                      borderRadius: theme.radius.lg,
                      background: copied 
                        ? `linear-gradient(135deg, ${theme.colors.emerald[6]} 0%, ${theme.colors.emerald[7]} 100%)`
                        : `linear-gradient(135deg, ${theme.colors.rose[5]} 0%, ${theme.colors.orange[5]} 100%)`,
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: isMobile ? '13px' : '15px',
                      boxShadow: `0 4px 16px ${theme.colors.rose[5]}4D`,
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
                    <Flex align="center" justify="center" gap="sm">
                      {copied ? (
                        <IconCheck size={isMobile ? 14 : 16} />
                      ) : (
                        <IconBrandInstagram size={isMobile ? 14 : 16} />
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
                      padding: isMobile ? '12px 16px' : '16px 20px',
                      borderRadius: theme.radius.lg,
                      background: copied 
                        ? `linear-gradient(135deg, ${theme.colors.emerald[6]} 0%, ${theme.colors.emerald[7]} 100%)`
                        : `linear-gradient(135deg, ${theme.colors.emerald[6]} 0%, ${theme.colors.emerald[7]} 100%)`,
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: isMobile ? '13px' : '15px',
                      boxShadow: `0 4px 16px ${theme.colors.emerald[6]}4D`,
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
                    <Flex align="center" justify="center" gap="sm">
                      {copied ? (
                        <IconCheck size={isMobile ? 14 : 16} />
                      ) : (
                        <IconBrandWechat size={isMobile ? 14 : 16} />
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
          <Center mt="md">
            <Text 
              fz={isMobile ? "sm" : "md"} 
              ta="center" 
              c="dimmed"
              maw={isMobile ? 300 : 350}
              px={{ base: 16, sm: 0 }}
              style={{
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              social_tip
            </Text>
          </Center>
        </Box>
      </Box>
    </Box>
  );
}
