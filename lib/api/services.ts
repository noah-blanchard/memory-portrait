import type { ApiResponse } from '@/types/api';
import type { BookingCreateInput } from '@/schemas/bookingCreate';
import type { BookingGrouped } from '@/schemas/bookingGrouped';
import type { BookingStatus } from '@/types/components';
import type { WeatherData } from '@/utils/weather/weatherService';

// Base API configuration
const API_BASE_URL = '';

interface ApiError extends Error {
  status?: number;
  code?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data: ApiResponse<T> = await response.json();

      if (!response.ok || !data.ok) {
        const error = new Error(
          data.ok === false ? data.error.message : 'Request failed'
        ) as ApiError;
        error.status = response.status;
        error.code = data.ok === false ? data.error.code : 'unknown';
        throw error;
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  // Booking Services
  async createBooking(data: BookingCreateInput): Promise<{ request_uid: string; created_at: string }> {
    return this.request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBookings(): Promise<BookingGrouped> {
    return this.request('/api/bookings', {
      method: 'GET',
    });
  }

  async searchBookings(params: Record<string, string | number | null>): Promise<BookingGrouped> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    return this.request(`/api/bookings/search?${searchParams.toString()}`, {
      method: 'GET',
    });
  }

  async updateBookingStatus(requestUid: string, status: BookingStatus): Promise<{
    request_uid: string;
    status: string;
    updated_at: string;
  }> {
    return this.request('/api/bookings/status', {
      method: 'PATCH',
      body: JSON.stringify({ requestUid, status }),
    });
  }

  // Weather Services
  async getWeather(location: string, date: string): Promise<WeatherData | null> {
    const params = new URLSearchParams({ location, date });
    return this.request(`/api/weather?${params}`, {
      method: 'GET',
    });
  }
}

export const apiService = new ApiService();

export const bookingService = {
  create: (data: BookingCreateInput) => apiService.createBooking(data),
  getAll: () => apiService.getBookings(),
  search: (params: Record<string, string | number | null>) => apiService.searchBookings(params),
  updateStatus: (requestUid: string, status: BookingStatus) => 
    apiService.updateBookingStatus(requestUid, status),
};

export const weatherService = {
  get: (location: string, date: string) => apiService.getWeather(location, date),
};
