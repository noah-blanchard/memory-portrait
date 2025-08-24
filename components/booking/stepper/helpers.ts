// pricing/estimatePrice.ts
export type EquipmentSelection = {
  equipCanonIxus980is?: boolean;
  equipHpCcd?: boolean;
  equipIphoneX?: boolean;
  equipIphone13?: boolean;
  equipNikonDslr?: boolean; // ← “DSLR package”
};

export type PriceBreakdown = {
  package: 'CCD/Phone' | 'DSLR' | 'None';
  hours: number;            // durée arrondie vers le haut (>= 1)
  base: number;             // $ hors couple/add-on
  coupleFee: number;        // $ surcharge couple (si >= 2 personnes)
  addonPhotos: number;      // nb de photos DSLR add-on retenues (0 si non applicable)
  addonCost: number;        // $ add-on DSLR (3$/photo, min 3)
  appliedDeal: 'dslr_2h' | 'dslr_3h' | null;
  total: number;            // base + coupleFee + addonCost
  warnings: string[];
  errors: string[];
};

const RATES = {
  CCD_PHONE_HOURLY: 35,
  DSLR_HOURLY: 50,
  COUPLE_SURCHARGE: {
    ccd_phone: 10,
    dslr: 15,
  },
  DSLR_ADDON_PER_PHOTO: 3,
  DSLR_ADDON_MIN_PHOTOS: 3,
} as const;

function ceilHours(h: number): number {
  if (!Number.isFinite(h) || h <= 0) return 1;
  return Math.ceil(h);
}

export function estimatePrice(params: {
  people?: number;                 // default 1
  equipment: EquipmentSelection;   // choix d’équipement
  addonPhotos?: number | null;     // nb de photos en add-on DSLR (si package CCD/Phone)
  durationHours: number;           // durée (sera arrondie à l’heure sup)
}): PriceBreakdown {
  const people = Math.max(1, Math.floor(params.people ?? 1));
  const hours = ceilHours(params.durationHours);
  const {
    equipCanonIxus980is,
    equipHpCcd,
    equipIphoneX,
    equipIphone13,
    equipNikonDslr,
  } = params.equipment;

  const hasCcd = !!(equipCanonIxus980is || equipHpCcd);
  const hasPhone = !!(equipIphoneX || equipIphone13);
  const hasCcdOrPhone = hasCcd || hasPhone;
  const hasDslr = !!equipNikonDslr;

  const warnings: string[] = [];
  const errors: string[] = [];

  // Déterminer le "package" choisi
  let chosen: PriceBreakdown['package'] = 'None';
  if (hasDslr && hasCcdOrPhone) {
    // On considère que DSLR + CCD/Phone => package CCD/Phone,
    // et DSLR ne peut être utilisé que comme add-on (photos).
    chosen = 'CCD/Phone';
  } else if (hasDslr) {
    chosen = 'DSLR';
  } else if (hasCcdOrPhone) {
    chosen = 'CCD/Phone';
  } else {
    chosen = 'None';
    errors.push('Select at least one equipment option.');
  }

  // Base + deal éventuel
  let base = 0;
  let appliedDeal: PriceBreakdown['appliedDeal'] = null;

  if (chosen === 'CCD/Phone') {
    base = hours * RATES.CCD_PHONE_HOURLY;
  } else if (chosen === 'DSLR') {
    // Deals spéciaux DSLR
    if (hours === 2) {
      base = 80; // save $20
      appliedDeal = 'dslr_2h';
    } else if (hours === 3) {
      base = 120; // save $30 (+ 2 retouches offertes, non tarifé ici)
      appliedDeal = 'dslr_3h';
    } else {
      base = hours * RATES.DSLR_HOURLY;
    }
  }

  // Surcharge couple (>= 2 personnes)
  let coupleFee = 0;
  if (people >= 2) {
    coupleFee =
      chosen === 'DSLR'
        ? RATES.COUPLE_SURCHARGE.dslr
        : chosen === 'CCD/Phone'
        ? RATES.COUPLE_SURCHARGE.ccd_phone
        : 0;
  }

  // Add-on DSLR photos (seulement si package CCD/Phone)
  let addonPhotos = 0;
  let addonCost = 0;

  if (chosen === 'CCD/Phone') {
    const wanted = Math.max(0, Math.floor(params.addonPhotos ?? 0));
    if (wanted > 0) {
      addonPhotos = Math.max(wanted, RATES.DSLR_ADDON_MIN_PHOTOS); // min 3
      addonCost = addonPhotos * RATES.DSLR_ADDON_PER_PHOTO;
    }
  } else if (chosen === 'DSLR' && (params.addonPhotos ?? 0) > 0) {
    warnings.push('DSLR add-on photos are only available with the CCD/Phone package – ignored.');
  }

  const total = round2(base + coupleFee + addonCost);

  return {
    package: chosen,
    hours,
    base: round2(base),
    coupleFee: round2(coupleFee),
    addonPhotos,
    addonCost: round2(addonCost),
    appliedDeal,
    total,
    warnings,
    errors,
  };
}

// Petite aide pour un arrondi propre
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
