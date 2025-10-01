'use client';

import Link from 'next/link';
import { IconBrandInstagram, IconBrandWechat, IconCamera } from '@tabler/icons-react';
import { Box, Container, CopyButton, Group, Paper, Stack } from '@mantine/core';
import { Badge, Button, Text, Title, Tooltip } from '@/components/I18nUI/I18nUI';

export default function HeroClient() {
  return (
    <Box component="section" py={{ base: 40, sm: 56, md: 72 }}>
      <Container size="md">
        <Stack gap="md" align="center">
          <Badge
            size="lg"
            variant="light"
            color="ocean"
            leftSection={<IconCamera size={16} />}
            styles={{ root: { fontWeight: 700, letterSpacing: 0.25 } }}
          >
            brand_name
          </Badge>

          <Title order={1} ta="center" style={{ lineHeight: 1.05 }}>
            <Text
              component="span"
              variant="gradient"
              gradient={{ from: 'ocean.6', to: 'emerald.5', deg: 45 }}
              inherit
            >
              welcome_title
            </Text>
          </Title>

          <Text ta="center" c="dimmed" maw={700} fz={{ base: 'md', sm: 'lg' }}>
            welcome_tagline
          </Text>

          <Group mt={{ base: 8, sm: 12 }} justify="center" w="100%">
            <Button
              component={Link}
              href="/booking"
              size="md"
              radius="xl"
              color="ocean"
              px="lg"
              w="min(640px, 100%)"
              leftSection={<IconCamera size={20} />}
            >
              cta_request
            </Button>
          </Group>
        </Stack>

        <Stack align="center" mt={{ base: 28, sm: 36 }} gap="sm">
          <Badge
            fw={700}
            size="lg"
            mb="xs"
            variant="light"
            color="ocean"
            styles={{ root: { width: 'min(640px, 100%)' } }}
          >
            socials
          </Badge>

          <Stack w="100%" maw={640} gap="sm">
            <CopyButton value="memory_portrait" timeout={1800}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'copied' : 'copy_handle'} withArrow>
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
                    {copied ? 'copied' : 'memory_portrait'}
                  </Button>
                </Tooltip>
              )}
            </CopyButton>

            <CopyButton value="Missnnuu" timeout={1800}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'copied' : 'copy_id'} withArrow>
                  <Button
                    onClick={copy}
                    leftSection={<IconBrandWechat size={22} />}
                    size="lg"
                    radius="xl"
                    variant="filled"
                    fullWidth
                    color={copied ? 'green' : 'emerald'}
                    styles={{
                      root: {
                        boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                      },
                    }}
                    aria-label="WeChat"
                  >
                    {copied ? 'copied' : 'Missnnuu'}
                  </Button>
                </Tooltip>
              )}
            </CopyButton>
          </Stack>

          <Paper mt="md" radius="lg" p="md" withBorder shadow="sm" maw={640} w="100%">
            <Text fz="sm" ta="center" c="dimmed">
              social_tip
            </Text>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}