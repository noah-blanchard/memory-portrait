/**
 * Barrel export pour tous les schémas de booking
 */

export { bookingCreateSchema } from './bookingCreate';
export { bookingGroupedSchema } from './bookingGrouped';
export { bookingStatusUpdateSchema } from './bookingStatusUpdate';
export { 
  contactStepSchema, 
  detailsStepSchema, 
  scheduleStepSchema, 
  equipmentStepSchema 
} from './bookingSteps';

// Ré-export de tous les schémas
export * from './bookingCreate';
export * from './bookingGrouped';
export * from './bookingStatusUpdate';
export * from './bookingSteps';
