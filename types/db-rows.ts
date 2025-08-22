// src/types/db-rows.ts
// --------------------------------------------
// Aliases pratiques pour manipuler ta BDD
// --------------------------------------------
import type { Database } from './supabase';

// ----- Enums -----
export type PhotoshootType = Database['public']['Enums']['photoshoot_type'];
export type BookingStatus = Database['public']['Enums']['booking_status'];
export type ContactMethod = Database['public']['Enums']['contact_method'];

// ----- Tables: admins -----
export type AdminsRow = Database['public']['Tables']['admins']['Row'];
export type AdminsInsert = Database['public']['Tables']['admins']['Insert'];
export type AdminsUpdate = Database['public']['Tables']['admins']['Update'];

// ----- Tables: unavailable_periods -----
export type UnavailablePeriodsRow = Database['public']['Tables']['unavailable_periods']['Row'];
export type UnavailablePeriodsInsert =
  Database['public']['Tables']['unavailable_periods']['Insert'];
export type UnavailablePeriodsUpdate =
  Database['public']['Tables']['unavailable_periods']['Update'];

// Alias utile pour le type de plage de temps (tstzrange) tel que généré par Supabase
export type TstzRange = UnavailablePeriodsRow['period'];

// ----- Tables: booking_requests -----
export type BookingRequestsRow = Database['public']['Tables']['booking_requests']['Row'];
export type BookingRequestsInsert = Database['public']['Tables']['booking_requests']['Insert'];
export type BookingRequestsUpdate = Database['public']['Tables']['booking_requests']['Update'];

// Raccourcis pratiques sur les colonnes générées
export type BookingRequestId = BookingRequestsRow['id'];
export type BookingRequestUID = BookingRequestsRow['request_uid'];
export type BookingRequestedRange = BookingRequestsRow['requested_period'];

// ----- RPC (facultatif mais pratique si tu utilises les fonctions SQL) -----
export type IsSlotAvailableArgs = Database['public']['Functions']['is_slot_available']['Args'];
export type IsSlotAvailableReturns =
  Database['public']['Functions']['is_slot_available']['Returns'];

export type SearchBookingRequestsArgs =
  Database['public']['Functions']['search_booking_requests']['Args'];
export type SearchBookingRequestsReturns =
  Database['public']['Functions']['search_booking_requests']['Returns'];
