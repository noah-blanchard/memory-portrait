'use client';

import { useRef } from 'react';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Group,
  InputLabel,
  NumberInput,
  NumberInputHandlers,
  NumberInputProps,
  Stack,
} from '@mantine/core';

type Props = NumberInputProps & {
  description?: string;
};

export default function ButtonNumberInput({
  label,
  description,
  min = 1,
  max = 6,
  value,
  size = 'lg', // <- force une hauteur cohérente
  ...props
}: Props) {
  const handlersRef = useRef<NumberInputHandlers>(null);

  // style commun pour caler les ronds exactement sur la hauteur de l'input
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
          aria-label="Decrement"
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
          style={{ flex: 1 }} // <- le fait grandir
          miw={0} // <- évite un min-width implicite
        />
        <ActionIcon
          style={circleStyle}
          radius="xl"
          variant="default"
          disabled={value === max}
          onClick={() => props?.onChange?.(Number(value) + 1)}
          aria-label="Increment"
          size="xl"
        >
          <IconPlus size={20} />
        </ActionIcon>
      </Group>
    </Stack>
  );
}
