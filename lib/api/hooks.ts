import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService, weatherService } from './services';
import type { BookingStatus } from '@/types/components';

// Query Keys
export const queryKeys = {
  bookings: ['bookings'] as const,
  searchBookings: (params: Record<string, string | number | null>) => ['searchBookings', params] as const,
  weather: (location: string, date: string) => ['weather', location, date] as const,
} as const;

// Booking Hooks
export function useBookings() {
  return useQuery({
    queryKey: queryKeys.bookings,
    queryFn: bookingService.getAll,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSearchBookings(params: Record<string, string | number | null>, enabled = true) {
  return useQuery({
    queryKey: queryKeys.searchBookings(params),
    queryFn: () => bookingService.search(params),
    enabled: enabled && Object.values(params).some(value => value !== null && value !== ''),
    staleTime: 10 * 1000, // 10 seconds for search results
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bookingService.create,
    onSuccess: () => {
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ requestUid, status }: { requestUid: string; status: BookingStatus }) =>
      bookingService.updateStatus(requestUid, status),
    onMutate: async ({ requestUid, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.bookings });
      await queryClient.cancelQueries({ 
        predicate: (query) => query.queryKey[0] === 'searchBookings'
      });
      
      // Snapshot previous values
      const previousBookings = queryClient.getQueryData(queryKeys.bookings);
      const previousSearchQueries = queryClient.getQueriesData({ 
        predicate: (query) => query.queryKey[0] === 'searchBookings'
      });
      
      // Helper function to update booking data
      const updateBookingData = (old: any) => {
        if (!old) {return old;}
        
        // Find the booking in the old data
        let foundBooking = null;
        let sourceStatus: BookingStatus | null = null;
        
        for (const [statusKey, bookings] of Object.entries(old)) {
          const bookingsArray = bookings as any[];
          const booking = bookingsArray.find((b: any) => b.request_uid === requestUid);
          if (booking) {
            foundBooking = booking;
            sourceStatus = statusKey as BookingStatus;
            break;
          }
        }
        
        if (!foundBooking || !sourceStatus) {
          return old;
        }
        
        // Create new data with moved booking
        const newData = { ...old };
        
        // Remove from source status
        newData[sourceStatus] = (newData[sourceStatus] as any[]).filter(
          (b: any) => b.request_uid !== requestUid
        );
        
        // Add to target status
        newData[status] = [
          { ...foundBooking, status },
          ...(newData[status] as any[])
        ];
        
        return newData;
      };
      
      // Optimistically update main bookings
      queryClient.setQueryData(queryKeys.bookings, updateBookingData);
      
      // Optimistically update all search queries
      previousSearchQueries.forEach(([queryKey, data]) => {
        if (data) {
          queryClient.setQueryData(queryKey, updateBookingData);
        }
      });
      
      return { previousBookings, previousSearchQueries };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousBookings) {
        queryClient.setQueryData(queryKeys.bookings, context.previousBookings);
      }
      if (context?.previousSearchQueries) {
        context.previousSearchQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'searchBookings'
      });
    },
  });
}

// Weather Hooks
export function useWeather(location: string, date: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.weather(location, date),
    queryFn: () => weatherService.get(location, date),
    enabled: enabled && !!location && !!date,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: 1000,
  });
}
