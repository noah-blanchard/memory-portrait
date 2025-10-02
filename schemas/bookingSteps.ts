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
        ctx.addIssue({ code: 'custom', path, message: 'validation_email_invalid' });
      }
      break;
    }
    case 'wechat': {
      const re = /^[A-Za-z][-_A-Za-z0-9]{5,19}$/;
      if (!re.test(contact)) {
        ctx.addIssue({
          code: 'custom',
          path,
          message: 'validation_wechat_invalid',
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
          message: 'validation_instagram_invalid',
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
          message: 'validation_phone_invalid',
        });
      }
      break;
    }
  }
}

export const contactStepSchema = z
  .object({
    clientName: z
      .string()
      .min(1, 'validation_name_required')
      .max(120)
      .transform(normalizeWhitespace),
    contactMethod: ContactMethodEnum,
    contact: z
      .string()
      .min(1, 'validation_contact_required')
      .max(120)
      .transform(normalizeWhitespace),
  })
  .superRefine((val, ctx) => {
    validateContactForMethod(val.contactMethod, val.contact, ctx);
  });

export const detailsStepSchema = z.object({
  photoshootKind: PhotoshootTypeEnum,
  location: z.string().min(2, 'validation_city_required').max(200).transform(normalizeWhitespace),
});

export const scheduleStepSchema = z.object({
  date: z.coerce
    .date()
    .refine(
      (date) => {
        return !isNaN(date.getTime());
      },
      {
        message: 'validation_date_invalid',
      }
    )
    .refine(
      (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      {
        message: 'validation_date_past',
      }
    ),
  time: z
    .string()
    .min(1, 'validation_time_required')
    .regex(/^\d{2}:\d{2}$/, 'validation_time_invalid')
    .refine(
      (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
      },
      {
        message: 'validation_time_invalid',
      }
    ),
  durationHours: z
    .number()
    .int()
    .min(1, 'validation_duration_min')
    .max(12, 'validation_duration_max'),
  extraEdits: z.number().min(0, 'validation_edits_min').max(50, 'validation_edits_max').optional(),
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
      z.number('validation_duration_required').int().min(1, 'validation_duration_min')
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
    }, z.number('validation_number_required').int().min(3).optional()),
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
        message: 'validation_equipment_required',
      });
    }

    if (!hasDslr && typeof v.dslrAddonPhotos !== 'undefined') {
      ctx.addIssue({
        code: 'custom',
        path: ['dslrAddonPhotos'],
        message: 'validation_dslr_addon_only_with_nikon',
      });
    }

    if (hasDslr && !hasCcdOrPhone && typeof v.dslrAddonPhotos !== 'undefined') {
      ctx.addIssue({
        code: 'custom',
        path: ['dslrAddonPhotos'],
        message: 'validation_addon_only_with_ccd_phone',
      });
    }

    if (includesCcdPhone && typeof v.dslrAddonPhotos !== 'undefined') {
      ctx.addIssue({
        code: 'custom',
        path: ['dslrAddonPhotos'],
        message: 'validation_nikon_includes_ccd_phone',
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

export function buildAndValidateBooking(
  contact: ContactStep,
  details: DetailsStep,
  schedule: ScheduleStep,
  equipment: EquipmentStep
) {
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
