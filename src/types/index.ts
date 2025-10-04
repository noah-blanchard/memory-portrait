/**
 * Barrel export pour tous les types du projet
 * Centralise l'accès aux types depuis un seul point d'entrée
 */

// Types API
export type { ApiResponse } from './api';

// Types de composants
export type { BookingStatus } from './components';

// Types Supabase
export type { Database } from './supabase';

// Ré-export de tous les types pour faciliter les imports
export * from './api';
export * from './components';
export * from './supabase';

// Exports spécifiques de db-rows pour éviter les conflits
export type { 
  BookingRequestsRow,
  BookingRequestsInsert,
  BookingRequestsUpdate,
  AdminsRow,
  UnavailablePeriodsRow,
  BookingRequestId,
  BookingRequestUID,
  BookingRequestedRange,
  IsSlotAvailableArgs,
  IsSlotAvailableReturns,
  SearchBookingRequestsArgs,
  SearchBookingRequestsReturns,
  TstzRange
} from './db-rows';
