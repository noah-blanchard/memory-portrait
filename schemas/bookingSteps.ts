import { z } from 'zod';
import { bookingCreateSchema, type BookingCreateInput } from './bookingCreate';
import { ContactMethodEnum, PhotoshootTypeEnum } from './enums';


/* --- mêmes petits helpers que dans bookingCreate --- */
const normalizeWhitespace = (s: string) => s.replace(/\s+/g, ' ').trim();
const stripPhone = (s: string) => s.replace(/[^\d+]/g, '');

/* --- validation contact (réutilisable) --- */
function validateContactForMethod(
  method: BookingCreateInput['contactMethod'],
  contact: string,
  ctx: z.RefinementCtx,
  path: (string | number)[] = ['contact']
) {
  switch (method) {
    case 'email': {
      if (!z.string().email().safeParse(contact).success) {
        ctx.addIssue({ code: 'custom', path, message: 'Invalid email' });
      }
      break;
    }
    case 'wechat': {
      const re = /^[A-Za-z][-_A-Za-z0-9]{5,19}$/;
      if (!re.test(contact)) {
        ctx.addIssue({
          code: 'custom',
          path,
          message: 'Invalid WeChat ID (6–20 chars, start with a letter, letters/digits/_/-)',
        });
      }
      break;
    }
    case 'instagram': {
      const re = /^(?!.*\.\.)(?!.*\.$)[A-Za-z0-9._]{1,30}$/;
      if (!re.test(contact)) {
        ctx.addIssue({
          code: 'custom',
          path,
          message: 'Invalid Instagram handle (letters/numbers . _ , 1–30 chars)',
        });
      }
      break;
    }
    case 'phone': {
      const stripped = stripPhone(contact);
      const re = /^\+?[1-9]\d{7,14}$/;
      if (!re.test(stripped)) {
        ctx.addIssue({
          code: 'custom',
          path,
          message: 'Invalid phone (use international format, e.g. +15551234567)',
        });
      }
      break;
    }
  }
}

/* ===================== STEP SCHEMAS ===================== */

/** Step 1: name + contact method + contact (1 champ par ligne) */
export const step1Schema = z
  .object({
    clientName: z.string().min(1).max(120).transform(normalizeWhitespace),
    contactMethod: ContactMethodEnum,
    contact: z.string().min(1, 'Contact is required').max(120).transform(normalizeWhitespace),
  })
  .superRefine((val, ctx) => {
    validateContactForMethod(val.contactMethod, val.contact, ctx);
  });

/** Step 2: photoshoot type + location (ville au Québec) */
export const step2Schema = z.object({
  photoshootKind: PhotoshootTypeEnum,
  location: z
    .string()
    .min(2, 'Please enter a city in Quebec')
    .max(200)
    .transform(normalizeWhitespace),
});

/** Step 3: date + time (HH:mm) + duration (1..3h) */
export const step3Schema = z.object({
  date: z.coerce.date(),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Pick a time (HH:mm)'),
  durationHours: z.number().int().min(1),
  extraEdits: z.number().min(0).optional(),
});

export const step4Schema = z
  .object({
    equipCanonIxus980is: z.boolean(),
    equipHpCcd: z.boolean(),
    equipIphoneX: z.boolean(),
    equipIphone13: z.boolean(),
    equipNikonDslr: z.boolean(),

    // Durée (pour gérer la règle "DSLR ≥ 2h => CCD/Phone inclus")
    durationHours: z.preprocess(
      (v) => {
        if (v === '' || v === null || typeof v === 'undefined') return undefined;
        const n = typeof v === 'string' ? Number(v) : v;
        return Number.isFinite(n) ? n : undefined;
      },
      z.number("Enter duration").int().min(1, 'Minimum 1 hour')
    ),

    // Add-on DSLR : optionnel, min 3 si présent
    dslrAddonPhotos: z.preprocess((v) => {
      if (v === '' || v === null || typeof v === 'undefined') return undefined;
      if (typeof v === 'string' && v.trim() === '') return undefined;
      const n = typeof v === 'string' ? Number(v) : v;
      return Number.isFinite(n) ? n : v;
    }, z.number('Enter a number').int().min(3).optional()),
  })
  .superRefine((v, ctx) => {
    const hasCCD = v.equipCanonIxus980is || v.equipHpCcd;
    const hasPhone = v.equipIphoneX || v.equipIphone13;
    const hasCcdOrPhone = hasCCD || hasPhone;
    const hasDslr = v.equipNikonDslr;

    const includesCcdPhone = !!hasDslr && Number(v.durationHours) >= 2;

    // 1) Au moins un équipement
    if (!hasDslr && !hasCcdOrPhone) {
      ctx.addIssue({
        code: 'custom',
        path: ['equipCanonIxus980is'],
        message: 'Please select at least one equipment option',
      });
    }

    // 2) Add-on interdit si pas de DSLR
    if (!hasDslr && typeof v.dslrAddonPhotos !== 'undefined') {
      ctx.addIssue({
        code: 'custom',
        path: ['dslrAddonPhotos'],
        message: 'DSLR add-on is only available when Nikon (DSLR) is selected.',
      });
    }

    // 3) Add-on interdit si DSLR seul (pas de CCD/Phone)
    if (hasDslr && !hasCcdOrPhone && typeof v.dslrAddonPhotos !== 'undefined') {
      ctx.addIssue({
        code: 'custom',
        path: ['dslrAddonPhotos'],
        message: 'Add-on only with CCD/Phone packages (not with DSLR alone).',
      });
    }

    // 4) Add-on interdit quand Nikon + durée ≥ 2h (CCD/Phone inclus gratuitement)
    if (includesCcdPhone && typeof v.dslrAddonPhotos !== 'undefined') {
      ctx.addIssue({
        code: 'custom',
        path: ['dslrAddonPhotos'],
        message: 'With Nikon 2h+, CCD/Phone are included — DSLR add-on not applicable.',
      });
    }

    // ✅ Plus d’obligation d’add-on quand DSLR est combiné avec CCD/Phone
    // (si hasDslr && hasCcdOrPhone && durée < 2h ⇒ add-on facultatif)
  });

export type Step1 = z.infer<typeof step1Schema>;
export type Step2 = z.infer<typeof step2Schema>;
export type Step3 = z.infer<typeof step3Schema>;
export type Step4 = z.infer<typeof step4Schema>;

/* ===================== COMPOSITION FINALE ===================== */

function mergeDateTime(d: Date, hhmm: string): Date {
  const [h, m] = hhmm.split(':').map((n) => parseInt(n, 10));
  const out = new Date(d);
  out.setHours(h, m, 0, 0);
  return out;
}

/** Construit l'objet final attendu par bookingCreateSchema, puis safeParse */
export function buildAndValidateBooking(s1: Step1, s2: Step2, s3: Step3, s4: Step4) {
  const start = mergeDateTime(s3.date, s3.time);
  const end = new Date(start.getTime() + s3.durationHours * 60 * 60 * 1000);

  // ⚠️ Ne pas typer directement en BookingCreateInput (c’est le type APRES transform)
  const candidate: BookingCreateInput = {
    clientName: s1.clientName,
    contactMethod: s1.contactMethod,
    contact: s1.contact,
    photoshootKind: s2.photoshootKind,
    start,
    end,
    location: s2.location || 'Montreal', // laisse le schéma gérer
    peopleCount: 1, // ok: le schéma a un default(1) aussi
    language: 'undefined',
    notes: 'undefined',

    // équipements (booléens) – valeurs par défaut false si non fournis
    equipCanonIxus980is: !!s4?.equipCanonIxus980is,
    equipHpCcd: !!s4?.equipHpCcd,
    equipIphoneX: !!s4?.equipIphoneX,
    equipIphone13: !!s4?.equipIphone13,
    equipNikonDslr: !!s4?.equipNikonDslr,
    extraEdits: s3?.extraEdits ?? 0,
  };

  // Validation + transforms (normalisation contact, checks cross-field, etc.)
  return bookingCreateSchema.safeParse(candidate);
}

/** (optionnel) aide pour router les erreurs du schéma final vers les steps */
export function splitFinalIssuesByStep(issues: z.ZodIssue[]) {
  const s1: Record<string, string> = {};
  const s2: Record<string, string> = {};
  const s3: Record<string, string> = {};

  for (const i of issues) {
    const key = i.path.join('.');
    const msg = i.message;
    if (key.startsWith('clientName') || key.startsWith('contact')) s1[key] = msg;
    else if (key.startsWith('photoshootKind') || key.startsWith('location')) s2[key] = msg;
    else if (key === 'start' || key === 'end') s3.time = msg; // mappe sur time/duration
  }
  return { s1, s2, s3 };
}