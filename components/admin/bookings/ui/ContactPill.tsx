'use client';

import {
  IconAt,
  IconBrandInstagram,
  IconBrandWechat,
  IconCheck,
  IconCopy,
  IconMail,
  IconPhone,
} from '@tabler/icons-react';
import { Badge, CopyButton, Group, Text, Tooltip } from '@mantine/core';
import { Button } from '@/components/I18nUI/I18nUI';

const methodColors: Record<string, string> = {
  email: 'blue',
  wechat: 'wechatGreen',
  instagram: 'pink',
  phone: 'orange',
};

export default function ContactPill({
  method,
  value,
}: {
  method: 'email' | 'wechat' | 'instagram' | 'phone';
  value: string;
}) {
  const icon =
    method === 'email' ? (
      <IconMail size={14} />
    ) : method === 'wechat' ? (
      <IconBrandWechat size={14} />
    ) : method === 'instagram' ? (
      <IconBrandInstagram size={14} />
    ) : (
      <IconPhone size={14} />
    );

  const label =
    method === 'email'
      ? 'Email'
      : method === 'wechat'
        ? 'WeChat'
        : method === 'instagram'
          ? 'Instagram'
          : 'Phone';

  return (
    <Group gap={8} w="100%" wrap="nowrap" justify="space-between" align="center">
      <Badge
        variant="outline"
        color={methodColors[method] || 'gray'}
        leftSection={icon}
        radius="sm"
      >
        {label}
      </Badge>
      <CopyButton value={value}>
        {({ copied, copy }) => (
          <Button
            variant="default"
            size="xs"
            onClick={copy}
            rightSection={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
            color={copied ? 'green' : 'gray'}
          >
            {value}
          </Button>
        )}
      </CopyButton>
    </Group>
  );
}
