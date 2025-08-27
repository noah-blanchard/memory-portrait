'use client';

import { IconAt, IconBrandInstagram, IconBrandWechat, IconCamera } from '@tabler/icons-react';
import { ActionIcon, Card, Container, CopyButton, Group, Stack } from '@mantine/core';
import { Anchor, Badge, Button, Text, Title } from '@/components/I18nUI/I18nUI';

export default function HeroClient() {
  return (
    <Container>
      <Stack gap="sm" align="center">
        <Badge
          size="lg"
          variant="light"
          color="sunnyYellow"
          leftSection={<IconCamera size={16} />}
          styles={{
            root: { fontWeight: 700 },
          }}
        >
          Memory Photoshoot
        </Badge>

        <Title order={1} ta="center" variant="gradient">
          welcome_title
        </Title>

        <Text
          size="lg"
          fw="bold"
          variant="gradient"
          gradient={{ from: 'sunnyYellow.7', to: 'sunnyYellow.3', deg: 45 }}
          ta="center"
          maw={720}
        >
          Believe me, your beauty has no limits
        </Text>

        <Group mt="lg" gap="md" justify="center" wrap="wrap" w="100%">
          <Anchor
            href="/booking"
            size="md"
            underline="always"
            fw={700}
            px="md"
            py="xs"
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--mantine-color-babyBlue-0)',
              border: '1px dashed var(--mantine-color-babyBlue-3)',
              borderRadius: 12,
              textDecoration: 'none',
              width: '100%',
              textUnderlineOffset: 4,
              transition: 'background 0.2s, border-color 0.2s',
              flex: 1,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                'var(--mantine-color-babyBlue-1)';
              (e.currentTarget as HTMLElement).style.borderColor =
                'var(--mantine-color-babyBlue-5)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                'var(--mantine-color-babyBlue-0)';
              (e.currentTarget as HTMLElement).style.borderColor =
                'var(--mantine-color-babyBlue-3)';
            }}
          >
            cta_request
          </Anchor>
        </Group>

        {/* Flèche animée vers le CTA principal */}
      </Stack>
      <Stack justify="center" align="center" mt="xl" gap="sm">
        <Badge fw={700} size="lg" mb="xs" fullWidth>
          Socials
        </Badge>
        <CopyButton value="memory_portrait" timeout={2000}>
          {({ copied, copy }) => (
            <Button
              aria-label="Instagram"
              size="lg"
              radius="xl"
              fullWidth
              variant="gradient"
              gradient={{ from: 'pink.5', to: 'orange.5', deg: 45 }}
              leftSection={<IconBrandInstagram size={24} />}
              onClick={copy}
              color={copied ? 'green' : undefined}
            >
              {copied ? 'Copied!' : 'memory_portrait'}
            </Button>
          )}
        </CopyButton>

        <CopyButton value="Missnuu" timeout={2000}>
          {({ copied, copy }) => (
            <Button
              fullWidth
              aria-label="WeChat"
              size="lg"
              radius="xl"
              variant="filled"
              bg="wechatGreen.5"
              leftSection={<IconBrandWechat size={24} />}
              onClick={copy}
              color={copied ? 'green' : undefined}
            >
              {copied ? 'Copied!' : 'Missnuu'}
            </Button>
          )}
        </CopyButton>
      </Stack>
    </Container>
  );
}
