export type EquipmentSelection = {
  equipCanonIxus980is?: boolean;
  equipHpCcd?: boolean;
  equipIphoneX?: boolean;
  equipIphone13?: boolean;
  equipNikonDslr?: boolean; // Big camera (DSLR)
};

export type PriceBreakdown = {
  package: 'CCD/Phone' | 'DSLR' | 'None';
  hours: number; // arrondi à l'heure sup (>=1 ; QC+DSLR => >=4)
  baseHourly: number; // 35 | 40 | 50 selon règles
  base: number; // baseHourly * hours

  // ➜ Ancienne compat
  coupleFee: number; // == peopleSurcharge (compat ancienne UI)
  addonPhotos: number; // add-on DSLR photos (seulement si package CCD/Phone)
  addonCost: number; // addonPhotos * 3
  appliedDeal: null; // (plus de deals 2h/3h) => null

  // ➜ Nouvelles infos
  peopleSurchargeHourly: number; // 10 (CCD/Phone) | 15 (DSLR)
  peopleSurcharge: number; // (people - 1) * peopleSurchargeHourly * hours
  cityFee: number; // 100 si Quebec City, sinon 0
  transportationFee: number; // param (variable, ex ~100)
  includedEdits: number; // edits inclus (4 de base ; DSLR ≥3h => +2/h >2h)
  extraEdits: number; // edits payants demandés
  extraEditsCost: number; // extraEdits * 3
  perks: string[]; // ex: "CCD/Phone inclus (≥ 2h DSLR)"

  total: number; // somme finale arrondie à 2 déc.
  warnings: string[];
  errors: string[];
};

export const RATES = {
  CCD_PHONE_HOURLY: 35,
  DSLR_HOURLY_1H: 50,
  DSLR_HOURLY_GT1H: 40,
  CCD_EXTRA_PER_PERSON_PER_HOUR: 10,
  DSLR_EXTRA_PER_PERSON_PER_HOUR: 15,
  CITY_FEE_QC: 100,
  EDIT_EXTRA_PRICE: 3,
  DSLR_ADDON_PER_PHOTO: 3,
  DSLR_ADDON_MIN_PHOTOS: 3,
} as const;

function ceilHours(h: number): number {
  if (!Number.isFinite(h) || h <= 0) return 1;
  return Math.ceil(h);
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function estimatePrice(params: {
  people?: number; // défaut 1
  equipment: EquipmentSelection; // choix d’équipement
  durationHours: number; // arrondi à l’heure sup
  addonPhotos?: number | null; // (hérité) nb photos add-on DSLR si package CCD/Phone
  location?: 'Montreal' | 'Quebec City'; // (note: garde l'espace double si c'est ce que tu utilises)
  transportationFee?: number; // défaut 0 (ex: ~100 à QC)
  extraEdits?: number; // nb d’edits payants supplémentaires
}): PriceBreakdown {
  const people = Math.max(1, Math.floor(params.people ?? 1));
  const location = params.location ?? 'Montreal';
  const transport =
    location === 'Quebec City' || params.transportationFee
      ? Math.max(100, Math.floor(params.transportationFee ?? 100))
      : 0;
  const extraEdits = Math.max(0, Math.floor(params.extraEdits ?? 0));

  const { equipCanonIxus980is, equipHpCcd, equipIphoneX, equipIphone13, equipNikonDslr } =
    params.equipment;

  const hasCcd = !!(equipCanonIxus980is || equipHpCcd);
  const hasPhone = !!(equipIphoneX || equipIphone13);
  const hasCcdOrPhone = hasCcd || hasPhone;
  const hasDslr = !!equipNikonDslr;

  const warnings: string[] = [];
  const errors: string[] = [];
  const perks: string[] = [];

  // ---- 1) Heures (arrondi) ----
  let hours = ceilHours(params.durationHours);

  // ---- 2) Choix du package (corrigé) ----
  // Règle: si DSLR sélectionné et heures ≥ 2 => package DSLR (CCD/Phone inclus automatiquement)
  //       si DSLR sélectionné et heures < 2 et CCD/Phone cochés => package CCD/Phone (DSLR = add-on)
  //       sinon règles classiques
  let chosen: PriceBreakdown['package'] = 'None';
  if (hasDslr) {
    if (hours >= 2) {
      chosen = 'DSLR';
    } else {
      chosen = hasCcdOrPhone ? 'CCD/Phone' : 'DSLR';
    }
  } else if (hasCcdOrPhone) {
    chosen = 'CCD/Phone';
  } else {
    chosen = 'None';
    errors.push('Select at least one equipment option.');
  }

  // ---- 3) Contrainte Québec City (min 4h si DSLR) ----
  if (location === 'Quebec City' && chosen === 'DSLR') {
    hours = Math.max(4, hours);
  }

  // ---- 4) Tarifs horaires ----
  let baseHourly = 0;
  if (chosen === 'CCD/Phone') {
    baseHourly = RATES.CCD_PHONE_HOURLY; // 35$/h
  } else if (chosen === 'DSLR') {
    baseHourly = hours === 1 ? RATES.DSLR_HOURLY_1H : RATES.DSLR_HOURLY_GT1H; // 50$/h puis 40$/h
  }

  // ---- 5) Règles combo & messages ----
  if (chosen === 'DSLR') {
    if (hours === 1 && hasCcdOrPhone) {
      warnings.push('1h DSLR : CCD/Phone non disponible — ignoré.');
    } else if (hours >= 2) {
      perks.push('CCD/Phone photos incluses gratuitement (≥ 2h DSLR).');
    }
  }

  // ---- 6) City fee + transport (QC) ----
  const cityFee = location === 'Quebec City' ? RATES.CITY_FEE_QC : 0;

  // ---- 7) Surcharge personnes (par heure) ----
  const extraPersons = Math.max(0, people - 1);
  const peopleSurchargeHourly =
    chosen === 'DSLR'
      ? RATES.DSLR_EXTRA_PER_PERSON_PER_HOUR
      : chosen === 'CCD/Phone'
        ? RATES.CCD_EXTRA_PER_PERSON_PER_HOUR
        : 0;
  const peopleSurcharge = extraPersons * peopleSurchargeHourly * hours;

  // ---- 8) Add-on DSLR photos (seulement si package CCD/Phone) ----
  let addonPhotos = 0;
  let addonCost = 0;
  if (chosen === 'CCD/Phone') {
    const wanted = Math.max(0, Math.floor(params.addonPhotos ?? 0));
    if (wanted > 0) {
      addonPhotos = Math.max(wanted, RATES.DSLR_ADDON_MIN_PHOTOS);
      addonCost = addonPhotos * RATES.DSLR_ADDON_PER_PHOTO; // 3$/photo
    }
  } else if (chosen === 'DSLR' && (params.addonPhotos ?? 0) > 0) {
    warnings.push('Add-on DSLR photos seulement avec le package CCD/Phone — ignoré.');
  }

  // ---- 9) Édits inclus + extras ----
  let includedEdits = 4; // base pour tous
  if (chosen === 'DSLR' && hours >= 3) {
    includedEdits = 4 + 2 * (hours - 2); // 3h=6, 4h=8, 5h=10...
  }
  const extraEditsCost = extraEdits > 0 ? extraEdits * RATES.EDIT_EXTRA_PRICE : 0;

  // ---- 10) Base & total ----
  const base = baseHourly * hours;
  const total = round2(base + peopleSurcharge + cityFee + transport + addonCost + extraEditsCost);

  return {
    package: chosen,
    hours,
    baseHourly,
    base: round2(base),

    // compat
    coupleFee: round2(peopleSurcharge),
    addonPhotos,
    addonCost: round2(addonCost),
    appliedDeal: null,

    // nouveaux champs
    peopleSurchargeHourly,
    peopleSurcharge: round2(peopleSurcharge),
    cityFee: round2(cityFee),
    transportationFee: round2(transport),
    includedEdits,
    extraEdits,
    extraEditsCost: round2(extraEditsCost),
    perks,
    warnings,
    errors,
    total,
  };
}
