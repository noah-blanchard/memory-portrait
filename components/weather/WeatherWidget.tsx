'use client';

import { useState, useEffect } from 'react';
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
import { weatherService, type WeatherData, type WeatherRecommendation } from '@/utils/weather/weatherService';

interface WeatherWidgetProps {
  date: Date | null;
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
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendation, setRecommendation] = useState<WeatherRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!date || !weatherService.isAvailable()) {
      setWeather(null);
      setRecommendation(null);
      return;
    }

    const fetchWeather = async () => {
      setLoading(true);
      setError(false);
      
      try {
        const weatherData = await weatherService.getWeatherForDate(location, date);
        
        if (weatherData) {
          setWeather(weatherData);
          const recommendation = weatherService.getPhotoshootRecommendation(weatherData);
          setRecommendation(recommendation);
        } else {
          setWeather(null);
          setRecommendation(null);
        }
      } catch (err) {
        setError(true);
        setWeather(null);
        setRecommendation(null);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch weather for dates within the next 3 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    if (selectedDate >= today && selectedDate <= threeDaysFromNow) {
      fetchWeather();
    } else {
      setWeather(null);
      setRecommendation(null);
    }
  }, [date, location]);

  // Don't render anything if weather service is not available or no data
  if (!weatherService.isAvailable() || error || (!loading && !weather)) {
    return null;
  }

  // Loading state
  if (loading) {
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

  if (!weather || !recommendation) {
    return null;
  }

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
