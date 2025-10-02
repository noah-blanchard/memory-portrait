/**
 * Weather Service - WeatherAPI.com Integration
 * Provides weather data for photoshoot planning
 */

export interface WeatherData {
  date: string; // YYYY-MM-DD format
  temperature: {
    min: number;
    max: number;
    current?: number;
  };
  condition: {
    main: string; // Clear, Clouds, Rain, etc.
    description: string; // clear sky, few clouds, etc.
    icon: string; // weather icon code
  };
  humidity: number;
  windSpeed: number;
  uvIndex?: number;
  sunrise?: string; // HH:MM format
  sunset?: string; // HH:MM format
  precipitation?: {
    probability: number; // 0-100
    amount?: number; // mm
  };
  visibility: number; // km
  cloudCover: number; // 0-100%
}

export interface WeatherRecommendation {
  type: 'excellent' | 'good' | 'fair' | 'poor';
  message: string;
  icon: string;
  color: string;
  suggestions: string[];
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

class WeatherService {
  private readonly API_KEY: string;
  private readonly BASE_URL = 'https://api.weatherapi.com/v1';
  private cache = new Map<string, { data: WeatherData[]; timestamp: number }>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  constructor() {
    this.API_KEY = process.env.NEXT_PUBLIC_WEATHERAPI_KEY || '';
    if (!this.API_KEY) {
      console.warn('WeatherAPI key not found. Weather features will be disabled.');
    }
  }

  /**
   * Check if weather service is available
   */
  isAvailable(): boolean {
    return !!this.API_KEY;
  }

  /**
   * Get weather forecast for a location (3 days)
   */
  async getForecast(location: string): Promise<WeatherData[]> {
    if (!this.isAvailable()) {
      return [];
    }

    const cacheKey = location.toLowerCase();
    const cached = this.cache.get(cacheKey);
    
    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const url = `${this.BASE_URL}/forecast.json?key=${this.API_KEY}&q=${encodeURIComponent(location)}&days=3&aqi=no&alerts=no`;
      const response = await fetch(url);

      if (!response.ok) {
        console.warn(`Weather API error: ${response.status}`);
        return [];
      }

      const data: WeatherAPIResponse = await response.json();
      const weatherData = this.transformWeatherData(data);
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: weatherData,
        timestamp: Date.now(),
      });

      return weatherData;
    } catch (error) {
      console.warn('Failed to fetch weather data:', error);
      return [];
    }
  }

  /**
   * Get weather for a specific date
   */
  async getWeatherForDate(location: string, date: Date | string): Promise<WeatherData | null> {
    const forecast = await this.getForecast(location);
    
    // Handle both Date objects and date strings
    let dateStr: string;
    if (typeof date === 'string') {
      // If it's already a string in YYYY-MM-DD format, use it directly
      dateStr = date;
    } else {
      // If it's a Date object, convert to local date string format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dateStr = `${year}-${month}-${day}`;
    }
    
    return forecast.find(weather => weather.date === dateStr) || null;
  }

  /**
   * Get photoshoot recommendation based on weather
   */
  getPhotoshootRecommendation(weather: WeatherData): WeatherRecommendation {
    const { condition, temperature, precipitation, windSpeed, cloudCover } = weather;
    
    // Excellent conditions
    if (
      condition.main === 'Clear' &&
      temperature.max >= 15 && temperature.max <= 25 &&
      windSpeed < 10 &&
      (precipitation?.probability || 0) < 10
    ) {
      return {
        type: 'excellent',
        message: 'Perfect for outdoor photography!',
        icon: '☀️',
        color: 'green',
        suggestions: [
          'Ideal lighting conditions',
          'Great for all photoshoot types',
          'Golden hour will be spectacular'
        ]
      };
    }

    // Good conditions
    if (
      ['Clear', 'Clouds'].includes(condition.main) &&
      temperature.max >= 10 &&
      windSpeed < 15 &&
      (precipitation?.probability || 0) < 30
    ) {
      const isPartlyCloudy = condition.main === 'Clouds' && cloudCover < 70;
      return {
        type: 'good',
        message: isPartlyCloudy ? 'Great diffused lighting!' : 'Good conditions for photos',
        icon: isPartlyCloudy ? '⛅' : '🌤️',
        color: 'blue',
        suggestions: [
          isPartlyCloudy ? 'Soft, even lighting' : 'Clear skies',
          'Suitable for outdoor shoots',
          'Consider backup indoor location'
        ]
      };
    }

    // Fair conditions
    if (
      temperature.max >= 5 &&
      windSpeed < 20 &&
      (precipitation?.probability || 0) < 60
    ) {
      return {
        type: 'fair',
        message: 'Manageable conditions with preparation',
        icon: '🌥️',
        color: 'yellow',
        suggestions: [
          'Indoor locations recommended',
          'Bring weather protection for equipment',
          'Consider rescheduling if possible'
        ]
      };
    }

    // Poor conditions
    return {
      type: 'poor',
      message: 'Challenging weather conditions',
      icon: '🌧️',
      color: 'red',
      suggestions: [
        'Indoor studio recommended',
        'Consider rescheduling',
        'Equipment protection essential'
      ]
    };
  }

  /**
   * Transform WeatherAPI.com response to our format
   */
  private transformWeatherData(data: WeatherAPIResponse): WeatherData[] {
    return data.forecast.forecastday.map(day => {
      // Map WeatherAPI condition codes to simplified main categories
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
        return 'Clouds'; // Default fallback
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
        cloudCover: 0, // WeatherAPI doesn't provide daily cloud cover average
      };
    });
  }
}

// Export singleton instance
export const weatherService = new WeatherService();
