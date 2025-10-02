'use client';

import { useRef } from 'react';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Group,
  NumberInput,
  NumberInputHandlers,
  NumberInputProps,
  Stack,
} from '@mantine/core';
import { Badge, InputLabel } from '@/components/I18nUI/I18nUI';

export interface ButtonNumberInputProps extends NumberInputProps {
  description?: string;
  min?: number;
  max?: number;
  value?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function ButtonNumberInput({
  label,
  description,
  min = 1,
  max = 6,
  value,
  size = 'lg',
  ...props
}: ButtonNumberInputProps) {
  const { t } = useTranslation('common');
  const handlersRef = useRef<NumberInputHandlers>(null);

  const circleStyle = {
    width: 'var(--input-height)',
    height: 'var(--input-height)',
  } as const;

  return (
    <Stack gap="xs" w="100%">
      <Group gap="xs">
        <InputLabel required={props.required}>{label}</InputLabel>
        {description && <Badge>{description}</Badge>}
      </Group>

      <Group w="100%" align="center" gap="md" wrap="nowrap">
        <ActionIcon
          style={circleStyle}
          radius="xl"
          variant="default"
          disabled={value === min}
          onClick={() => props?.onChange?.(Number(value) - 1)}
          aria-label={t('receipt_decrement')}
          size="xl"
        >
          <IconMinus size={20} />
        </ActionIcon>
        <NumberInput
          {...props}
          size={size}
          hideControls
          handlersRef={handlersRef}
          min={min}
          max={max}
          value={value}
          style={{ flex: 1 }}
          miw={0}
        />
        <ActionIcon
          style={circleStyle}
          radius="xl"
          variant="default"
          disabled={value === max}
          onClick={() => props?.onChange?.(Number(value) + 1)}
          aria-label={t('receipt_increment')}
          size="xl"
        >
          <IconPlus size={20} />
        </ActionIcon>
      </Group>
    </Stack>
  );
}
