export type EquipmentSelection = {
  equipCanonIxus980is?: boolean;
  equipHpCcd?: boolean;
  equipIphoneX?: boolean;
  equipIphone13?: boolean;
  equipNikonDslr?: boolean;
};

export type PriceBreakdown = {
  package: 'CCD/Phone' | 'DSLR' | 'None';
  hours: number;
  baseHourly: number;
  base: number;

  coupleFee: number;
  addonPhotos: number;
  addonCost: number;
  appliedDeal: null;

  peopleSurchargeHourly: number;
  peopleSurcharge: number;
  cityFee: number;
  transportationFee: number;
  includedEdits: number;
  extraEdits: number;
  extraEditsCost: number;
  perks: string[];

  total: number;
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
  if (!Number.isFinite(h) || h <= 0) {
    return 1;
  }
  return Math.ceil(h);
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function estimatePrice(params: {
  people?: number;
  equipment: EquipmentSelection;
  durationHours: number;
  addonPhotos?: number | null;
  location?: 'Montreal' | 'Quebec City';
  transportationFee?: number;
  extraEdits?: number;
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

  let hours = ceilHours(params.durationHours);

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

  if (location === 'Quebec City' && chosen === 'DSLR') {
    hours = Math.max(4, hours);
  }

  let baseHourly = 0;
  if (chosen === 'CCD/Phone') {
    baseHourly = RATES.CCD_PHONE_HOURLY; // 35$/h
  } else if (chosen === 'DSLR') {
    baseHourly = hours === 1 ? RATES.DSLR_HOURLY_1H : RATES.DSLR_HOURLY_GT1H; // 50$/h puis 40$/h
  }

  if (chosen === 'DSLR') {
    if (hours === 1 && hasCcdOrPhone) {
      warnings.push('1h DSLR : CCD/Phone non disponible — ignoré.');
    } else if (hours >= 2) {
      perks.push('CCD/Phone photos incluses gratuitement (≥ 2h DSLR).');
    }
  }

  const cityFee = location === 'Quebec City' ? RATES.CITY_FEE_QC : 0;

  const extraPersons = Math.max(0, people - 1);
  const peopleSurchargeHourly =
    chosen === 'DSLR'
      ? RATES.DSLR_EXTRA_PER_PERSON_PER_HOUR
      : chosen === 'CCD/Phone'
        ? RATES.CCD_EXTRA_PER_PERSON_PER_HOUR
        : 0;
  const peopleSurcharge = extraPersons * peopleSurchargeHourly * hours;

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

  let includedEdits = 4; // base pour tous
  if (chosen === 'DSLR' && hours >= 3) {
    includedEdits = 4 + 2 * (hours - 2); // 3h=6, 4h=8, 5h=10...
  }
  const extraEditsCost = extraEdits > 0 ? extraEdits * RATES.EDIT_EXTRA_PRICE : 0;

  const base = baseHourly * hours;
  const total = round2(base + peopleSurcharge + cityFee + transport + addonCost + extraEditsCost);

  return {
    package: chosen,
    hours,
    baseHourly,
    base: round2(base),

    coupleFee: round2(peopleSurcharge),
    addonPhotos,
    addonCost: round2(addonCost),
    appliedDeal: null,

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
