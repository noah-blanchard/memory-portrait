'use client';

import { useTranslation } from 'react-i18next';
import {
  Box,
  Group,
  Text,
  Paper,
  Stack,
  Badge,
  Skeleton,
} from '@mantine/core';
import {
  IconSun,
  IconCloud,
  IconCloudRain,
  IconSnowflake,
  IconBolt,
  IconDroplet,
  IconSunrise,
  IconSunset,
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useWeather } from '@/lib/api/hooks';
import { weatherService, type WeatherRecommendation } from '@/utils/weather/weatherService';

interface WeatherWidgetProps {
  date: Date | string | null;
  location?: string;
}

const getWeatherIcon = (condition: string, size = 20) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return <IconSun size={size} />;
    case 'clouds':
      return <IconCloud size={size} />;
    case 'rain':
    case 'drizzle':
      return <IconCloudRain size={size} />;
    case 'snow':
      return <IconSnowflake size={size} />;
    case 'thunderstorm':
      return <IconBolt size={size} />;
    default:
      return <IconCloud size={size} />;
  }
};

const getRecommendationColor = (type: WeatherRecommendation['type']) => {
  switch (type) {
    case 'excellent':
      return 'green';
    case 'good':
      return 'blue';
    case 'fair':
      return 'yellow';
    case 'poor':
      return 'red';
    default:
      return 'gray';
  }
};

export default function WeatherWidget({ date, location = 'Montreal' }: WeatherWidgetProps) {
  const { t } = useTranslation('common');
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Check if we should fetch weather (within next 3 days)
  const shouldFetchWeather = (() => {
    if (!date || !weatherService.isAvailable()) {
      return false;
    }
    
    // Ensure we have a Date object
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return false;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDate = new Date(dateObj);
    selectedDate.setHours(0, 0, 0, 0);
    
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    return selectedDate >= today && selectedDate <= threeDaysFromNow;
  })();

  // Format date for API call
  const dateStr = (() => {
    if (!date) {
      return '';
    }
    
    // Ensure we have a Date object
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
  })();

  // Use TanStack Query
  const { data: weather, isLoading, error } = useWeather(
    location,
    dateStr,
    shouldFetchWeather
  );

  // Don't render anything if weather service is not available or no data
  if (!weatherService.isAvailable() || error || (!isLoading && !weather)) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <Paper
        p={isMobile ? 'sm' : 'md'}
        radius="md"
        style={{
          background: 'linear-gradient(135deg, var(--mantine-color-blue-0) 0%, var(--mantine-color-cyan-0) 100%)',
          border: '1px solid var(--mantine-color-blue-2)',
        }}
      >
        <Stack gap="xs">
          <Group gap="xs">
            <Skeleton height={20} width={20} radius="sm" />
            <Skeleton height={16} width={120} radius="sm" />
          </Group>
          <Skeleton height={14} width="100%" radius="sm" />
          <Group gap="xs">
            <Skeleton height={12} width={60} radius="sm" />
            <Skeleton height={12} width={80} radius="sm" />
          </Group>
        </Stack>
      </Paper>
    );
  }

  if (!weather) {
    return null;
  }

  const recommendation = weatherService.getPhotoshootRecommendation(weather);

  return (
    <Paper
      p={isMobile ? 'sm' : 'md'}
      radius="md"
      style={{
        background: 'linear-gradient(135deg, var(--mantine-color-blue-0) 0%, var(--mantine-color-cyan-0) 100%)',
        border: '1px solid var(--mantine-color-blue-2)',
        transition: 'all 0.2s ease',
      }}
    >
      <Stack gap="md">
        {/* Weather Overview */}
        <Group justify="space-between" align="flex-start">
          <Group gap="sm" align="center">
            {getWeatherIcon(weather.condition.main, isMobile ? 24 : 28)}
            <Box>
              <Text size={isMobile ? 'md' : 'lg'} fw={600} c="blue.8">
                {weather.temperature.max}°C / {weather.temperature.min}°C
              </Text>
              <Text size="sm" c="blue.6" tt="capitalize">
                {weather.condition.description}
              </Text>
            </Box>
          </Group>
          
          <Badge
            color={getRecommendationColor(recommendation.type)}
            variant="light"
            size={isMobile ? 'md' : 'lg'}
            leftSection={<span style={{ fontSize: '14px' }}>{recommendation.icon}</span>}
          >
            {recommendation.type === 'excellent' && t('weather_excellent', 'Excellent')}
            {recommendation.type === 'good' && t('weather_good', 'Good')}
            {recommendation.type === 'fair' && t('weather_fair', 'Fair')}
            {recommendation.type === 'poor' && t('weather_poor', 'Poor')}
          </Badge>
        </Group>

        {/* Weather Details */}
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <IconDroplet size={14} style={{ color: 'var(--mantine-color-blue-5)' }} />
            <Text size="sm" c="blue.6">
              {weather.precipitation?.probability || 0}% {t('weather_rain', 'rain')}
            </Text>
          </Group>

          {weather.sunrise && weather.sunset && (
            <Group gap="sm">
              <IconSunrise size={14} style={{ color: 'var(--mantine-color-orange-5)' }} />
              <Text size="sm" c="blue.6">
                {weather.sunrise}
              </Text>
              <IconSunset size={14} style={{ color: 'var(--mantine-color-orange-5)' }} />
              <Text size="sm" c="blue.6">
                {weather.sunset}
              </Text>
            </Group>
          )}
        </Group>

        {/* Photography Comment */}
        <Text size="sm" c="blue.6" fs="italic">
          {t(`weather_${recommendation.type}_message`, recommendation.message)}
        </Text>
      </Stack>
    </Paper>
  );
}
