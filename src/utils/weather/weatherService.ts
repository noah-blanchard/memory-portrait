export interface WeatherData {
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

export interface WeatherRecommendation {
  type: 'excellent' | 'good' | 'fair' | 'poor';
  message: string;
  icon: string;
  color: string;
  suggestions: string[];
}

interface WeatherApiResponse {
  ok: boolean;
  data: WeatherData | null;
  error?: {
    code: string;
    message: string;
  };
}

class WeatherService {
  isAvailable(): boolean {
    return true;
  }

  async getWeatherForDate(location: string, date: Date | string): Promise<WeatherData | null> {
    let dateStr: string;
    if (typeof date === 'string') {
      dateStr = date;
    } else {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dateStr = `${year}-${month}-${day}`;
    }

    try {
      const params = new URLSearchParams({
        location,
        date: dateStr,
      });
      
      const response = await fetch(`/api/weather?${params}`, {
        method: 'GET',
      });

      if (!response.ok) {
        return null;
      }

      const result: WeatherApiResponse = await response.json();
      
      if (!result.ok) {
        return null;
      }

      return result.data;
    } catch (error) {
      return null;
    }
  }

  getPhotoshootRecommendation(weather: WeatherData): WeatherRecommendation {
    const { condition, temperature, precipitation, windSpeed, cloudCover } = weather;
    
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

}

export const weatherService = new WeatherService();
