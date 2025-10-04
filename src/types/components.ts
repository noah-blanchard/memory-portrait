import type { UseFormReturnType } from '@mantine/form';
import type { ReactNode } from 'react';

// Common component prop patterns
export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
}

// Form step component props
export interface FormStepProps<T = Record<string, unknown>> {
  form: UseFormReturnType<T>;
  loading?: boolean;
}

// Booking form type
export interface BookingFormData {
  clientName: string;
  contactMethod: string;
  contact: string;
  photoshootKind: string;
  location: string;
  peopleCount: number;
  date: Date | null;
  time: string;
  durationHours: number;
  equipCanonIxus980is: boolean;
  equipHpCcd: boolean;
  equipIphoneX: boolean;
  equipIphone13: boolean;
  equipNikonDslr: boolean;
  dslrAddonPhotos: number;
  extraEdits: number;
}

export interface NavigableStepProps extends FormStepProps {
  onBack?: () => void;
  onNext?: () => void;
}

// Booking step specific props
export interface BookingStepProps extends NavigableStepProps {
  // Specific to booking steps
}

// Admin component props
export interface AdminComponentProps {
  loading?: boolean;
  error?: string | null;
}

// Status and data handling
export interface StatusChangeHandler<T = string> {
  onChangeStatus?: (id: string, status: T) => void | Promise<void>;
}

// Common data props
export interface DataComponentProps<T> {
  data: T | null;
  loading?: boolean;
  error?: string | null;
}

// Layout props
export interface LayoutProps {
  children: ReactNode;
}

// Modal/Dialog props
export interface ModalProps extends BaseComponentProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
}

// Form input props
export interface FormInputProps {
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

// Contact method types
export type ContactMethod = 'email' | 'wechat' | 'instagram' | 'phone';

// Booking status types
export type BookingStatus = 'pending' | 'reviewed' | 'approved' | 'rejected' | 'cancelled';

// Photoshoot types
export type PhotoshootType = 'tourism' | 'linkedin' | 'event' | 'family' | 'portrait' | 'product';

// Equipment selection interface
export interface EquipmentSelection {
  equipCanonIxus980is: boolean;
  equipHpCcd: boolean;
  equipIphoneX: boolean;
  equipIphone13: boolean;
  equipNikonDslr: boolean;
}

// Pricing parameters
export interface PricingParams {
  people?: number;
  equipment: EquipmentSelection;
  durationHours: number;
  location?: string;
  addonPhotos?: number;
  extraEdits?: number;
}

// API response types
export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Language types
export type Language = 'en' | 'zh';

// Theme and styling
export interface ThemeProps {
  variant?: 'light' | 'dark';
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
