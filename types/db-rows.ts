import type { Database } from './supabase';

export type PhotoshootType = Database['public']['Enums']['photoshoot_type'];
export type BookingStatus = Database['public']['Enums']['booking_status'];
export type ContactMethod = Database['public']['Enums']['contact_method'];

export type AdminsRow = Database['public']['Tables']['admins']['Row'];
export type AdminsInsert = Database['public']['Tables']['admins']['Insert'];
export type AdminsUpdate = Database['public']['Tables']['admins']['Update'];

export type UnavailablePeriodsRow = Database['public']['Tables']['unavailable_periods']['Row'];
export type UnavailablePeriodsInsert =
  Database['public']['Tables']['unavailable_periods']['Insert'];
export type UnavailablePeriodsUpdate =
  Database['public']['Tables']['unavailable_periods']['Update'];

export type TstzRange = UnavailablePeriodsRow['period'];

export type BookingRequestsRow = Database['public']['Tables']['booking_requests']['Row'];
export type BookingRequestsInsert = Database['public']['Tables']['booking_requests']['Insert'];
export type BookingRequestsUpdate = Database['public']['Tables']['booking_requests']['Update'];

export type BookingRequestId = BookingRequestsRow['id'];
export type BookingRequestUID = BookingRequestsRow['request_uid'];
export type BookingRequestedRange = BookingRequestsRow['requested_period'];

export type IsSlotAvailableArgs = Database['public']['Functions']['is_slot_available']['Args'];
export type IsSlotAvailableReturns =
  Database['public']['Functions']['is_slot_available']['Returns'];

export type SearchBookingRequestsArgs =
  Database['public']['Functions']['search_booking_requests']['Args'];
export type SearchBookingRequestsReturns =
  Database['public']['Functions']['search_booking_requests']['Returns'];
