import { NextResponse } from 'next/server';
import { weatherRequestSchema } from '@/schemas/weather';
import type { ApiResponse } from '@/types/api';
import {
  createServerErrorResponse,
  createSuccessResponse,
} from '@/utils/response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface WeatherData {
  date: string;
  temperature: {
    min: number;
    max: number;
    current?: number;
  };
  condition: {
    main: string;
    description: string;
    icon: string;
  };
  humidity: number;
  windSpeed: number;
  uvIndex?: number;
  sunrise?: string;
  sunset?: string;
  precipitation?: {
    probability: number;
    amount?: number;
  };
  visibility: number;
  cloudCover: number;
}

interface WeatherAPIResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    vis_km: number;
    uv: number;
    gust_kph: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      date_epoch: number;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        totalsnow_cm: number;
        avgvis_km: number;
        avghumidity: number;
        daily_will_it_rain: number;
        daily_chance_of_rain: number;
        daily_will_it_snow: number;
        daily_chance_of_snow: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        uv: number;
      };
      astro: {
        sunrise: string;
        sunset: string;
        moonrise: string;
        moonset: string;
        moon_phase: string;
        moon_illumination: string;
      };
      hour: Array<{
        time_epoch: number;
        time: string;
        temp_c: number;
        is_day: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        pressure_mb: number;
        precip_mm: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        windchill_c: number;
        heatindex_c: number;
        dewpoint_c: number;
        will_it_rain: number;
        chance_of_rain: number;
        will_it_snow: number;
        chance_of_snow: number;
        vis_km: number;
        gust_kph: number;
        uv: number;
      }>;
    }>;
  };
}

export async function GET(req: Request): Promise<NextResponse<ApiResponse<WeatherData | null>>> {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get('location');
  const date = searchParams.get('date');

  if (!location || !date) {
    return createServerErrorResponse('Missing required parameters: location and date');
  }

  const validation = weatherRequestSchema.safeParse({ location, date });
  if (!validation.success) {
    const errorMessages = validation.error.issues.map(i => i.message).join(', ');
    return createServerErrorResponse(`Invalid parameters: ${errorMessages}`);
  }

  const { location: validatedLocation, date: validatedDate } = validation.data;

  try {
    const API_KEY = process.env.WEATHERAPI_KEY;
    if (!API_KEY) {
      return createServerErrorResponse('Weather service not configured');
    }

    const apiLocation = validatedLocation.toLowerCase() === 'quebec city' ? 'Quebec' : validatedLocation;

    const BASE_URL = 'https://api.weatherapi.com/v1';
    const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(apiLocation)}&days=3&aqi=no&alerts=no`;
    
    const response = await fetch(url);

    if (!response.ok) {
      return createServerErrorResponse('Weather service unavailable');
    }

    const data: WeatherAPIResponse = await response.json();
    const weatherData = transformWeatherData(data);
    
    const weatherForDate = weatherData.find(weather => weather.date === validatedDate) || null;

    return createSuccessResponse(weatherForDate, 200);
  } catch (e: unknown) {
    return createServerErrorResponse('Failed to fetch weather data');
  }
}

function transformWeatherData(data: WeatherAPIResponse): WeatherData[] {
  return data.forecast.forecastday.map(day => {
    const getMainCondition = (code: number): string => {
      if (code === 1000) {
        return 'Clear';
      }
      if ([1003, 1006, 1009].includes(code)) {
        return 'Clouds';
      }
      if ([1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246, 1273, 1276].includes(code)) {
        return 'Rain';
      }
      if ([1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282].includes(code)) {
        return 'Snow';
      }
      if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
        return 'Thunderstorm';
      }
      if ([1030, 1135, 1147].includes(code)) {
        return 'Mist';
      }
      return 'Clouds';
    };

    return {
      date: day.date,
      temperature: {
        min: Math.round(day.day.mintemp_c),
        max: Math.round(day.day.maxtemp_c),
        current: Math.round(day.day.avgtemp_c),
      },
      condition: {
        main: getMainCondition(day.day.condition.code),
        description: day.day.condition.text.toLowerCase(),
        icon: day.day.condition.icon,
      },
      humidity: Math.round(day.day.avghumidity),
      windSpeed: Math.round(day.day.maxwind_kph),
      uvIndex: day.day.uv,
      sunrise: day.astro.sunrise,
      sunset: day.astro.sunset,
      precipitation: {
        probability: Math.max(day.day.daily_chance_of_rain, day.day.daily_chance_of_snow),
        amount: day.day.totalprecip_mm,
      },
      visibility: Math.round(day.day.avgvis_km),
      cloudCover: 0,
    };
  });
}
