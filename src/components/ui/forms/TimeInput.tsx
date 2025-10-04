'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TextInput,
  Box,
} from '@mantine/core';
import { IconClock, IconChevronDown } from '@tabler/icons-react';
import TimePickerModal from './TimePickerModal';

interface TimeInputProps {
  label?: string;
  description?: string;
  placeholder?: string;
  value?: string; // HH:MM format
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  min?: string; // HH:MM format
  max?: string; // HH:MM format
}

export default function TimeInput({
  label,
  description,
  placeholder = 'Select time',
  value = '',
  onChange,
  error,
  required = false,
  disabled = false,
  size = 'sm',
  min = '06:00',
  max = '22:00',
}: TimeInputProps) {
  const { t } = useTranslation('common');
  const [modalOpened, setModalOpened] = useState(false);

  // Format time for display (12-hour format with AM/PM)
  const formatDisplayTime = (timeStr: string) => {
    if (!timeStr) {
      return '';
    }
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const handleTimeChange = (newTime: string) => {
    onChange?.(newTime);
  };

  const displayValue = value ? formatDisplayTime(value) : '';

  return (
    <>
      <Box>
        <TextInput
          label={label}
          description={description}
          placeholder={placeholder}
          value={displayValue}
          error={error}
          required={required}
          disabled={disabled}
          size={size}
          readOnly
          leftSection={<IconClock size={16} />}
          rightSection={
            <IconChevronDown 
              size={16} 
              style={{ 
                transition: 'transform 200ms ease',
                transform: modalOpened ? 'rotate(180deg)' : 'rotate(0deg)',
              }} 
            />
          }
          styles={{
            input: {
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontVariant: 'tabular-nums',
              '&:focus': {
                borderColor: 'var(--mantine-color-blue-filled)',
                boxShadow: '0 0 0 2px rgba(34, 139, 230, 0.2)',
              },
            },
          }}
          onClick={() => !disabled && setModalOpened(true)}
        />
      </Box>

      <TimePickerModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        value={value || '09:00'}
        onChange={handleTimeChange}
        label={label || t('select_time', 'Select Time')}
        min={min}
        max={max}
      />
    </>
  );
}
