# Structure du Projet Memory Portrait

Cette documentation décrit la nouvelle architecture organisée du projet Memory Portrait.

## 📁 Structure des Dossiers

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Routes d'authentification
│   │   ├── admin-login/          # Page de connexion admin
│   │   └── layout.tsx            # Layout pour les routes auth
│   ├── (dashboard)/              # Routes du dashboard admin
│   │   ├── admin/                # Dashboard principal
│   │   ├── admin-bookings/       # Gestion des réservations
│   │   └── layout.tsx            # Layout pour les routes dashboard
│   ├── (public)/                 # Routes publiques
│   │   ├── booking/              # Formulaire de réservation
│   │   └── layout.tsx            # Layout pour les routes publiques
│   ├── api/                      # API Routes
│   │   ├── bookings/             # Endpoints de réservations
│   │   └── weather/              # Endpoints météo
│   ├── globals.css               # Styles globaux
│   ├── layout.tsx                # Layout racine
│   ├── page.tsx                  # Page d'accueil
│   ├── providers.tsx             # Providers React
│   └── _hero-client.tsx         # Composant hero client
├── components/                   # Composants réutilisables
│   ├── ui/                       # Composants UI de base
│   │   ├── buttons/              # Boutons et contrôles
│   │   ├── forms/                # Composants de formulaires
│   │   ├── layout/               # Composants de layout
│   │   └── feedback/             # Composants de feedback
│   ├── features/                # Composants métier
│   │   ├── auth/                 # Authentification
│   │   ├── booking/              # Réservations
│   │   ├── admin/                # Administration
│   │   └── weather/              # Météo
│   └── common/                  # Composants communs
│       ├── transitions/         # Animations et transitions
│       └── i18n/                # Internationalisation
├── lib/                          # Logique métier
│   ├── api/                      # Services API
│   ├── auth/                     # Authentification
│   ├── email/                    # Service email
│   ├── i18n/                     # Internationalisation
│   └── providers/                # Providers React
├── hooks/                        # Hooks personnalisés
├── types/                        # Types TypeScript
├── schemas/                      # Schémas de validation
│   ├── booking/                  # Schémas de réservation
│   ├── auth/                     # Schémas d'authentification
│   └── weather/                  # Schémas météo
├── utils/                        # Utilitaires
│   ├── api/                      # Utilitaires API
│   ├── validation/               # Validation
│   ├── supabase/                 # Configuration Supabase
│   └── weather/                  # Services météo
├── locales/                      # Traductions
│   ├── en/                       # Anglais
│   └── zh/                       # Chinois
├── config/                       # Configuration
│   ├── theme.ts                  # Thème Mantine
│   ├── eslint.config.mjs         # Configuration ESLint
│   ├── jest.config.cjs          # Configuration Jest
│   ├── next.config.mjs          # Configuration Next.js
│   └── postcss.config.cjs       # Configuration PostCSS
└── tests/                        # Tests
    ├── utils/                    # Utilitaires de test
    └── setup/                    # Configuration des tests
```

## 🎯 Principes d'Organisation

### 1. **Séparation par Domaine**
- Chaque domaine métier (auth, booking, admin, weather) a son propre dossier
- Les composants sont organisés par fonctionnalité plutôt que par type

### 2. **Composants UI vs Features**
- **UI** : Composants réutilisables sans logique métier
- **Features** : Composants avec logique métier spécifique

### 3. **Barrel Exports**
- Chaque dossier a un `index.ts` pour faciliter les imports
- Imports centralisés et cohérents

### 4. **Configuration Centralisée**
- Tous les fichiers de config dans `src/config/`
- Chemins d'alias documentés dans `src/config/paths.ts`

## 📦 Imports Recommandés

```typescript
// Composants
import { AdminLayout, BookingCard } from '@/components/features/admin';
import { PublicLayout } from '@/components/ui/layout';
import { NumberInput, TimeInput } from '@/components/ui/forms';

// Types
import type { BookingStatus, ApiResponse } from '@/types';

// Schémas
import { bookingCreateSchema } from '@/schemas/booking';

// Hooks
import { usePageTransition } from '@/hooks';

// Utilitaires
import { createSuccessResponse } from '@/utils/api';
```

## 🔄 Migration

Cette nouvelle structure améliore :
- **Maintenabilité** : Code organisé par domaine
- **Scalabilité** : Structure claire pour ajouter de nouvelles fonctionnalités
- **Lisibilité** : Imports cohérents et prévisibles
- **Performance** : Barrel exports optimisent les imports
