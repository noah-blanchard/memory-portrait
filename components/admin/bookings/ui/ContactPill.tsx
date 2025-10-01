'use client';

import {
  IconBrandInstagram,
  IconBrandWechat,
  IconCheck,
  IconCopy,
  IconMail,
  IconPhone,
} from '@tabler/icons-react';
import { CopyButton, Group } from '@mantine/core';
import { Badge, Button } from '@/components/I18nUI/I18nUI';
import { useTranslation } from 'react-i18next';

const methodColors: Record<string, string> = {
  email: 'blue',
  wechat: 'emerald',
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
  const { t } = useTranslation('common');
  
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
      ? t('contact_email')
      : method === 'wechat'
        ? t('contact_wechat')
        : method === 'instagram'
          ? t('contact_instagram')
          : t('contact_phone');

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
            {copied ? t('copied') : value}
          </Button>
        )}
      </CopyButton>
    </Group>
  );
}
