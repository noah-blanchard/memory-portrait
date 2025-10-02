'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Stack,
  Group,
  Button,
  Text,
  ScrollArea,
  Center,
  Paper,
} from '@mantine/core';
import { IconClock } from '@tabler/icons-react';

interface TimePickerModalProps {
  opened: boolean;
  onClose: () => void;
  value?: string; // HH:MM format
  onChange: (time: string) => void;
  label?: string;
  min?: string; // HH:MM format
  max?: string; // HH:MM format
}

export default function TimePickerModal({
  opened,
  onClose,
  value = '09:00',
  onChange,
  label = 'Select Time',
  min = '06:00',
  max = '22:00',
}: TimePickerModalProps) {
  const { t } = useTranslation('common');
  
  // Parse time string to hours and minutes
  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours, minutes };
  };

  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const { hours: minHours } = parseTime(min);
  const { hours: maxHours } = parseTime(max);
  const { hours: currentHours, minutes: currentMinutes } = parseTime(value);

  const [selectedHours, setSelectedHours] = useState(currentHours);
  const [selectedMinutes, setSelectedMinutes] = useState(currentMinutes);

  // Update selected values when value prop changes
  useEffect(() => {
    const { hours, minutes } = parseTime(value);
    setSelectedHours(hours);
    setSelectedMinutes(minutes);
  }, [value]);

  // Generate hours array based on min/max constraints
  const generateHours = () => {
    const hours = [];
    for (let h = minHours; h <= maxHours; h++) {
      hours.push(h);
    }
    return hours;
  };

  // Generate minutes array (every 15 minutes for better UX)
  const generateMinutes = () => {
    return [0, 15, 30, 45];
  };

  const hours = generateHours();
  const minutes = generateMinutes();

  const handleConfirm = () => {
    const timeString = formatTime(selectedHours, selectedMinutes);
    onChange(timeString);
    onClose();
  };

  const handleCancel = () => {
    // Reset to original value
    const { hours, minutes } = parseTime(value);
    setSelectedHours(hours);
    setSelectedMinutes(minutes);
    onClose();
  };

  // Format time for display (12-hour format with AM/PM)
  const formatDisplayTime = (hours: number, minutes: number) => {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCancel}
      title={
        <Group gap="xs">
          <IconClock size={20} />
          <Text fw={600}>{label}</Text>
        </Group>
      }
      centered
      size="sm"
      radius="lg"
      styles={{
        content: {
          overflow: 'visible',
        },
        body: {
          padding: '1.5rem',
        },
      }}
    >
      <Stack gap="xl">
        {/* Current Selection Display */}
        <Center>
          <Paper
            p="lg"
            radius="xl"
            bg="var(--mantine-color-blue-light)"
            style={{
              border: '2px solid var(--mantine-color-blue-filled)',
            }}
          >
            <Text
              size="xl"
              fw={700}
              c="blue"
              ta="center"
              style={{ fontVariant: 'tabular-nums' }}
            >
              {formatDisplayTime(selectedHours, selectedMinutes)}
            </Text>
          </Paper>
        </Center>

        {/* Time Picker Wheels */}
        <Group gap="md" justify="center" align="flex-start">
          {/* Hours Wheel */}
          <Stack gap="xs" align="center">
            <Text size="sm" fw={500} c="dimmed">
              {t('time_hours', 'Hours')}
            </Text>
            <ScrollArea
              h={200}
              w={80}
              scrollbarSize={4}
              styles={{
                scrollbar: {
                  '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
                    backgroundColor: 'var(--mantine-color-blue-filled)',
                  },
                },
              }}
            >
              <Stack gap={0}>
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    variant={selectedHours === hour ? 'filled' : 'subtle'}
                    color={selectedHours === hour ? 'blue' : 'gray'}
                    size="sm"
                    radius="md"
                    onClick={() => setSelectedHours(hour)}
                    styles={{
                      root: {
                        fontVariant: 'tabular-nums',
                        minHeight: '40px',
                        fontSize: '16px',
                        fontWeight: selectedHours === hour ? 600 : 400,
                      },
                    }}
                  >
                    {hour.toString().padStart(2, '0')}
                  </Button>
                ))}
              </Stack>
            </ScrollArea>
          </Stack>

          {/* Separator */}
          <Center h={200}>
            <Text size="xl" fw={700} c="dimmed">
              :
            </Text>
          </Center>

          {/* Minutes Wheel */}
          <Stack gap="xs" align="center">
            <Text size="sm" fw={500} c="dimmed">
              {t('time_minutes', 'Minutes')}
            </Text>
            <ScrollArea
              h={200}
              w={80}
              scrollbarSize={4}
              styles={{
                scrollbar: {
                  '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
                    backgroundColor: 'var(--mantine-color-blue-filled)',
                  },
                },
              }}
            >
              <Stack gap={0}>
                {minutes.map((minute) => (
                  <Button
                    key={minute}
                    variant={selectedMinutes === minute ? 'filled' : 'subtle'}
                    color={selectedMinutes === minute ? 'blue' : 'gray'}
                    size="sm"
                    radius="md"
                    onClick={() => setSelectedMinutes(minute)}
                    styles={{
                      root: {
                        fontVariant: 'tabular-nums',
                        minHeight: '40px',
                        fontSize: '16px',
                        fontWeight: selectedMinutes === minute ? 600 : 400,
                      },
                    }}
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </Stack>
            </ScrollArea>
          </Stack>
        </Group>

        {/* Action Buttons */}
        <Group justify="space-between" mt="md">
          <Button
            variant="subtle"
            color="gray"
            onClick={handleCancel}
            size="md"
            radius="lg"
            flex={1}
          >
            {t('cancel', 'Cancel')}
          </Button>
          <Button
            variant="filled"
            color="blue"
            onClick={handleConfirm}
            size="md"
            radius="lg"
            flex={1}
          >
            {t('confirm', 'Confirm')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
