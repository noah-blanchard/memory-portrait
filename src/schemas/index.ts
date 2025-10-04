/**
 * Barrel export pour tous les schémas du projet
 */

// Schémas de booking
export * from './booking';

// Schémas de weather
export * from './weather';

// Schémas communs - exports spécifiques pour éviter les conflits
export { 
  ContactMethodEnum, 
  PhotoshootTypeEnum, 
  BookingStatusEnum 
} from './enums';
export * from './helpers';
