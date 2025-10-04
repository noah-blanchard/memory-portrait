/**
 * Configuration des chemins d'alias pour le projet
 * Utilisé pour les imports et la résolution de modules
 */

export const paths = {
  // App routes
  app: {
    auth: {
      adminLogin: '/admin-login',
    },
    dashboard: {
      admin: '/admin',
      adminBookings: '/admin-bookings',
    },
    public: {
      booking: '/booking',
    },
  },
  
  // Component paths
  components: {
    ui: '@/components/ui',
    features: '@/components/features',
    common: '@/components/common',
  },
  
  // Library paths
  lib: {
    api: '@/lib/api',
    auth: '@/lib/auth',
    email: '@/lib/email',
    i18n: '@/lib/i18n',
    providers: '@/lib/providers',
  },
  
  // Utility paths
  utils: {
    api: '@/utils/api',
    validation: '@/utils/validation',
    supabase: '@/utils/supabase',
    weather: '@/utils/weather',
  },
  
  // Schema paths
  schemas: {
    booking: '@/schemas/booking',
    auth: '@/schemas/auth',
    weather: '@/schemas/weather',
  },
  
  // Type paths
  types: '@/types',
  
  // Hook paths
  hooks: '@/hooks',
  
  // Locale paths
  locales: '@/locales',
} as const;

export default paths;
