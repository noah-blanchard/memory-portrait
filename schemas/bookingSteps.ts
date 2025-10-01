import { z } from 'zod';
import { bookingCreateSchema, type BookingCreateInput } from './bookingCreate';
import { ContactMethodEnum, PhotoshootTypeEnum } from './enums';


const normalizeWhitespace = (s: string) => s.replace(/\s+/g, ' ').trim();
const stripPhone = (s: string) => s.replace(/[^\d+]/g, '');
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

export const contactStepSchema = z
  .object({
    clientName: z.string().min(1).max(120).transform(normalizeWhitespace),
    contactMethod: ContactMethodEnum,
    contact: z.string().min(1, 'Contact is required').max(120).transform(normalizeWhitespace),
  })
  .superRefine((val, ctx) => {
    validateContactForMethod(val.contactMethod, val.contact, ctx);
  });

export const detailsStepSchema = z.object({
  photoshootKind: PhotoshootTypeEnum,
  location: z
    .string()
    .min(2, 'Please enter a city in Quebec')
    .max(200)
    .transform(normalizeWhitespace),
});

export const scheduleStepSchema = z.object({
  date: z.coerce.date(),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Pick a time (HH:mm)'),
  durationHours: z.number().int().min(1),
  extraEdits: z.number().min(0).optional(),
});

export const equipmentStepSchema = z
  .object({
    equipCanonIxus980is: z.boolean(),
    equipHpCcd: z.boolean(),
    equipIphoneX: z.boolean(),
    equipIphone13: z.boolean(),
    equipNikonDslr: z.boolean(),

    durationHours: z.preprocess(
      (v) => {
        if (v === '' || v === null || typeof v === 'undefined') {
          return undefined;
        }
        const n = typeof v === 'string' ? Number(v) : v;
        return Number.isFinite(n) ? n : undefined;
      },
      z.number("Enter duration").int().min(1, 'Minimum 1 hour')
    ),

    dslrAddonPhotos: z.preprocess((v) => {
      if (v === '' || v === null || typeof v === 'undefined') {
        return undefined;
      }
      if (typeof v === 'string' && v.trim() === '') {
        return undefined;
      }
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

    if (!hasDslr && !hasCcdOrPhone) {
      ctx.addIssue({
        code: 'custom',
        path: ['equipCanonIxus980is'],
        message: 'Please select at least one equipment option',
      });
    }

    if (!hasDslr && typeof v.dslrAddonPhotos !== 'undefined') {
      ctx.addIssue({
        code: 'custom',
        path: ['dslrAddonPhotos'],
        message: 'DSLR add-on is only available when Nikon (DSLR) is selected.',
      });
    }

    if (hasDslr && !hasCcdOrPhone && typeof v.dslrAddonPhotos !== 'undefined') {
      ctx.addIssue({
        code: 'custom',
        path: ['dslrAddonPhotos'],
        message: 'Add-on only with CCD/Phone packages (not with DSLR alone).',
      });
    }

    if (includesCcdPhone && typeof v.dslrAddonPhotos !== 'undefined') {
      ctx.addIssue({
        code: 'custom',
        path: ['dslrAddonPhotos'],
        message: 'With Nikon 2h+, CCD/Phone are included — DSLR add-on not applicable.',
      });
    }

  });

export type ContactStep = z.infer<typeof contactStepSchema>;
export type DetailsStep = z.infer<typeof detailsStepSchema>;
export type ScheduleStep = z.infer<typeof scheduleStepSchema>;
export type EquipmentStep = z.infer<typeof equipmentStepSchema>;


function mergeDateTime(d: Date, hhmm: string): Date {
  const [h, m] = hhmm.split(':').map((n) => parseInt(n, 10));
  const out = new Date(d);
  out.setHours(h, m, 0, 0);
  return out;
}

export function buildAndValidateBooking(contact: ContactStep, details: DetailsStep, schedule: ScheduleStep, equipment: EquipmentStep) {
  const start = mergeDateTime(schedule.date, schedule.time);
  const end = new Date(start.getTime() + schedule.durationHours * 60 * 60 * 1000);

  const candidate: BookingCreateInput = {
    clientName: contact.clientName,
    contactMethod: contact.contactMethod,
    contact: contact.contact,
    photoshootKind: details.photoshootKind,
    start,
    end,
    location: details.location || 'Montreal', // laisse le schéma gérer
    peopleCount: 1, // ok: le schéma a un default(1) aussi
    language: 'undefined',
    notes: 'undefined',

    equipCanonIxus980is: !!equipment?.equipCanonIxus980is,
    equipHpCcd: !!equipment?.equipHpCcd,
    equipIphoneX: !!equipment?.equipIphoneX,
    equipIphone13: !!equipment?.equipIphone13,
    equipNikonDslr: !!equipment?.equipNikonDslr,
    extraEdits: schedule?.extraEdits ?? 0,
  };

  return bookingCreateSchema.safeParse(candidate);
}

export function splitFinalIssuesByStep(issues: z.ZodIssue[]) {
  const s1: Record<string, string> = {};
  const s2: Record<string, string> = {};
  const s3: Record<string, string> = {};

  for (const i of issues) {
    const key = i.path.join('.');
    const msg = i.message;
    if (key.startsWith('clientName') || key.startsWith('contact')) {
      s1[key] = msg;
    } else if (key.startsWith('photoshootKind') || key.startsWith('location')) {
      s2[key] = msg;
    } else if (key === 'start' || key === 'end') {
      s3.time = msg;
    }
  }
  return { s1, s2, s3 };
}