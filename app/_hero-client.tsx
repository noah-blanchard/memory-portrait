'use client';

import Link from 'next/link';
import { IconBrandInstagram, IconBrandWechat, IconCamera } from '@tabler/icons-react';
import { Badge, Box, Button, Container, CopyButton, Group, Paper, Stack, Text, Title, Tooltip } from '@mantine/core';


/**
 * Goals:
 * - Keep the same features (CTA to /booking, socials with copy-to-clipboard, gradient accents)
 * - Make the visual hierarchy tighter & coherent
 * - Avoid manual DOM style tweaks; rely on Mantine props & states
 * - Provide better focus/hover/pressed states and responsive spacing
 */
export default function HeroClient() {
  return (
    <Box component="section" py={{ base: 40, sm: 56, md: 72 }}>
      <Container size="md">
        <Stack gap="md" align="center">
          {/* Brand badge */}
          <Badge
            size="lg"
            variant="light"
            color="sunnyYellow"
            leftSection={<IconCamera size={16} />}
            styles={{ root: { fontWeight: 700, letterSpacing: 0.25 } }}
          >
            Memory Photoshoot
          </Badge>

          {/* Title */}
          <Title order={1} ta="center" style={{ lineHeight: 1.05 }}>
            <Text
              component="span"
              variant="gradient"
              gradient={{ from: 'sunnyYellow.7', to: 'sunnyYellow.3', deg: 45 }}
              inherit
            >
              Welcome to Memory Photoshoot!
            </Text>
          </Title>

          {/* Subtitle */}
          <Text ta="center" c="dimmed" maw={700} fz={{ base: 'md', sm: 'lg' }}>
            Believe me, your beauty has no limits
          </Text>

          {/* Primary CTA */}
          <Group mt={{ base: 8, sm: 12 }} justify="center" w="100%">
            <Button
              component={Link}
              href="/booking"
              size="md"
              radius="xl"
              color="babyBlue"
              px="lg"
              w="min(640px, 100%)"
              leftSection={<IconCamera size={20} />}
            >
              Request a photoshoot now!
            </Button>
          </Group>
        </Stack>

        {/* Socials */}
        <Stack align="center" mt={{ base: 28, sm: 36 }} gap="sm">
          <Badge
            fw={700}
            size="lg"
            mb="xs"
            variant="light"
            color="babyBlue"
            styles={{ root: { width: 'min(640px, 100%)' } }}
          >
            SOCIALS
          </Badge>

          <Stack w="100%" maw={640} gap="sm">
            {/* Instagram */}
            <CopyButton value="memory_portrait" timeout={1800}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied!' : 'Copy handle'} withArrow>
                  <Button
                    onClick={copy}
                    leftSection={<IconBrandInstagram size={22} />}
                    size="lg"
                    radius="xl"
                    variant="gradient"
                    gradient={{ from: 'pink.5', to: 'orange.5', deg: 45 }}
                    fullWidth
                    styles={{
                      root: { boxShadow: '0 6px 16px rgba(0,0,0,0.08)' },
                    }}
                    aria-label="Instagram"
                  >
                    {copied ? 'Copied!' : 'memory_portrait'}
                  </Button>
                </Tooltip>
              )}
            </CopyButton>

            {/* WeChat */}
            <CopyButton value="Missnnuu" timeout={1800}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied!' : 'Copy ID'} withArrow>
                  <Button
                    onClick={copy}
                    leftSection={<IconBrandWechat size={22} />}
                    size="lg"
                    radius="xl"
                    variant="filled"
                    fullWidth
                    styles={{
                      root: {
                        background: 'var(--mantine-color-wechatGreen-5)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                      },
                    }}
                    aria-label="WeChat"
                    color={copied ? 'green' : undefined}
                  >
                    {copied ? 'Copied!' : 'Missnnuu'}
                  </Button>
                </Tooltip>
              )}
            </CopyButton>
          </Stack>

          {/* Decorative card to anchor the content visually */}
          <Paper mt="md" radius="lg" p="md" withBorder shadow="sm" maw={640} w="100%">
            <Text fz="sm" ta="center" c="dimmed">
              Tip: Click any social button to copy the handle to your clipboard.
            </Text>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}