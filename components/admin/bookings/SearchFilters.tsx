'use client';

import {
  IconSearch,
  IconFilter,
  IconX,
  IconCalendar,
  IconMapPin,
  IconUser,
} from '@tabler/icons-react';
import {
  Group,
  TextInput,
  Paper,
  Stack,
  Badge,
  ActionIcon,
  Collapse,
  Text,
  MultiSelect,
  NumberInput,
  SimpleGrid,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { Button as I18nButton } from '@/components/I18nUI/I18nUI';

export interface SearchFilters {
  q: string;
  status: string[];
  client_name: string;
  contact: string;
  location: string;
  date_from: string;
  date_to: string;
  people_count: number | null;
  budget_min: number | null;
  budget_max: number | null;
  language: string;
  sort_by: string;
  sort_order: string;
}

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const sortOptions = [
  { value: 'created_at', label: 'Created Date' },
  { value: 'starts_at', label: 'Start Date' },
  { value: 'client_name', label: 'Client Name' },
  { value: 'status', label: 'Status' },
];

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: 'Chinese' },
  { value: 'fr', label: 'French' },
];

export default function SearchFilters({ filters, onFiltersChange, onClearFilters }: SearchFiltersProps) {
  const [filtersOpened, { toggle: toggleFilters }] = useDisclosure(false);

  const hasActiveFilters = Object.values(filters).some(value => {
    return Array.isArray(value) ? value.length > 0 : value !== '' && value !== null;
  });

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="md">
        {/* Search Bar */}
        <Group gap="sm">
          <TextInput
            placeholder="Search bookings..."
            leftSection={<IconSearch size={16} />}
            value={filters.q}
            onChange={(e) => updateFilter('q', e.target.value)}
            style={{ flex: 1 }}
            size="sm"
          />
          
          <I18nButton
            variant="light"
            leftSection={<IconFilter size={16} />}
            onClick={toggleFilters}
            size="sm"
          >
            Filters
            {hasActiveFilters && (
              <Badge size="xs" color="blue" ml="xs">
                {Object.values(filters).filter(value => 
                  Array.isArray(value) ? value.length > 0 : value !== '' && value !== null
                ).length}
              </Badge>
            )}
          </I18nButton>

          {hasActiveFilters && (
            <ActionIcon
              variant="light"
              color="gray"
              onClick={onClearFilters}
              size="sm"
            >
              <IconX size={16} />
            </ActionIcon>
          )}
        </Group>

        {/* Advanced Filters */}
        <Collapse in={filtersOpened}>
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              <MultiSelect
                label="Status"
                placeholder="Select statuses"
                data={statusOptions}
                value={filters.status}
                onChange={(value) => updateFilter('status', value)}
                leftSection={<IconUser size={16} />}
                size="sm"
                clearable
              />

              <TextInput
                label="Client Name"
                placeholder="Search by client name"
                value={filters.client_name}
                onChange={(e) => updateFilter('client_name', e.target.value)}
                size="sm"
              />

              <TextInput
                label="Contact"
                placeholder="Search by contact info"
                value={filters.contact}
                onChange={(e) => updateFilter('contact', e.target.value)}
                size="sm"
              />

              <TextInput
                label="Location"
                placeholder="Search by location"
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                leftSection={<IconMapPin size={16} />}
                size="sm"
              />

              <NumberInput
                label="People Count"
                placeholder="Filter by people count"
                value={filters.people_count || undefined}
                onChange={(value) => updateFilter('people_count', typeof value === 'number' ? value : null)}
                size="sm"
                min={1}
              />

              <MultiSelect
                label="Language"
                placeholder="Select language"
                data={languageOptions}
                value={filters.language ? [filters.language] : []}
                onChange={(value) => updateFilter('language', value[0] || '')}
                size="sm"
                clearable
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
              <DateInput
                label="From Date"
                placeholder="Select start date"
                value={filters.date_from ? new Date(filters.date_from) : null}
                onChange={(value) => updateFilter('date_from', value ? (value as unknown as Date).toISOString().split('T')[0] : '')}
                leftSection={<IconCalendar size={16} />}
                size="sm"
                clearable
              />

              <DateInput
                label="To Date"
                placeholder="Select end date"
                value={filters.date_to ? new Date(filters.date_to) : null}
                onChange={(value) => updateFilter('date_to', value ? (value as unknown as Date).toISOString().split('T')[0] : '')}
                leftSection={<IconCalendar size={16} />}
                size="sm"
                clearable
              />

              <NumberInput
                label="Min Budget"
                placeholder="Minimum budget"
                value={filters.budget_min || undefined}
                onChange={(value) => updateFilter('budget_min', typeof value === 'number' ? value : null)}
                size="sm"
                min={0}
              />

              <NumberInput
                label="Max Budget"
                placeholder="Maximum budget"
                value={filters.budget_max || undefined}
                onChange={(value) => updateFilter('budget_max', typeof value === 'number' ? value : null)}
                size="sm"
                min={0}
              />
            </SimpleGrid>

            <Group gap="md">
              <MultiSelect
                label="Sort By"
                placeholder="Select sort field"
                data={sortOptions}
                value={[filters.sort_by]}
                onChange={(value) => updateFilter('sort_by', value[0] || 'created_at')}
                size="sm"
                style={{ flex: 1 }}
              />

              <MultiSelect
                label="Sort Order"
                placeholder="Select sort order"
                data={[
                  { value: 'asc', label: 'Ascending' },
                  { value: 'desc', label: 'Descending' },
                ]}
                value={[filters.sort_order]}
                onChange={(value) => updateFilter('sort_order', value[0] || 'desc')}
                size="sm"
                style={{ flex: 1 }}
              />
            </Group>
          </Stack>
        </Collapse>

        {/* Results Summary */}
        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed">
            {hasActiveFilters ? 'Filters applied' : 'No filters applied'}
          </Text>
          
          {hasActiveFilters && (
            <I18nButton
              variant="subtle"
              size="xs"
              onClick={onClearFilters}
              rightSection={<IconX size={12} />}
            >
              Clear All
            </I18nButton>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}
