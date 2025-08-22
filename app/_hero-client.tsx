'use client';

import { IconBrandInstagram, IconBrandWechat, IconCamera } from '@tabler/icons-react';
import { ActionIcon, Card, Container, Group, Stack } from '@mantine/core';
import { Anchor, Badge, Button, Text, Title } from '@/components/I18nUI/I18nUI';
import LandingIllustration from '@/components/svgs-illustrations/LandingIllustration';

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
          welcome_tagline
        </Text>

        <Group mt="lg" gap="md" justify="center" wrap="wrap">
          {/* <Button
              component={Link}
              href="/request"
              size="md"
              radius="lg"
              color="babyBlue"
              style={{ fontWeight: 700 }}
            >
              {t("cta_request")}
            </Button> */}

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
              textUnderlineOffset: 4,
              transition: 'background 0.2s, border-color 0.2s',
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
      <Group justify="center" mt="xl" gap="sm">
        <ActionIcon
          aria-label="Instagram"
          size="lg"
          radius="xl"
          variant="gradient"
          gradient={{ from: 'pink.5', to: 'orange.5', deg: 45 }}
        >
          <IconBrandInstagram size={18} />
        </ActionIcon>

        <ActionIcon
          aria-label="WeChat"
          size="lg"
          radius="xl"
          variant="filled"
          bg="wechatGreen.5" // vert WeChat
        >
          <IconBrandWechat size={18} />
        </ActionIcon>
      </Group>
    </Container>
  );
}
