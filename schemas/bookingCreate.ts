// src/schemas/booking.ts
import { z } from 'zod';
import { ContactMethodEnum, PhotoshootTypeEnum } from './enums';
import { normalizeWhitespace, stripPhone } from './helpers';

function msToH(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return { hours, minutes };
}

export const bookingCreateSchema = z
  .object({
    clientName: z.string().transform(normalizeWhitespace).pipe(z.string().min(1).max(120)),

    contactMethod: ContactMethodEnum,
    contact: z
      .string()
      .min(1, 'Contact is required')
      .max(120, 'Contact too long')
      .transform(normalizeWhitespace),

    photoshootKind: PhotoshootTypeEnum,

    start: z.coerce.date(),
    end: z.coerce.date(),

    location: z
      .string()
      .transform(normalizeWhitespace)
      .optional()
      .default(undefined)
      .pipe(z.string().max(200)),

    peopleCount: z.coerce.number().int().gte(1, 'peopleCount must be >= 1').default(1),

    language: z
      .string()
      .max(16, 'Language code too long')
      .transform(normalizeWhitespace)
      .optional()
      .default(undefined),

    notes: z
      .string()
      .max(2000, 'Notes too long')
      .transform((s) => s.trim())
      .optional()
      .default(undefined),

    // --------- ÉQUIPEMENTS ----------
    equipCanonIxus980is: z.boolean().default(false),
    equipHpCcd: z.boolean().default(false),
    equipIphoneX: z.boolean().default(false),
    equipIphone13: z.boolean().default(false),
    equipNikonDslr: z.boolean().default(false),

    // Add-on DSLR (nombre de photos) :
    // nullable/opcional, mais obligatoire (>=3) quand DSLR + (CCD ou Phone)
    dslrAddonPhotos: z.coerce
      .number()
      .int()
      .min(3, 'At least 3 photos for DSLR add-on')
      .optional()
      .nullable(),

    // --------- RETOUCHES SUPPLÉMENTAIRES ----------
    // Nombre d’allers-retours de retouche supplémentaires au-delà de ce qui est inclus
    extraEdits: z.coerce
      .number()
      .int()
      .min(0, 'extraEdits must be >= 0')
      .max(20, 'extraEdits too large')
      .default(0),
  })
  .superRefine((val, ctx) => {
    // 1) période valide
    if (val.start.getTime() >= val.end.getTime()) {
      ctx.addIssue({ code: 'custom', path: ['end'], message: 'End must be after start' });
    }

    // 2) contact valide selon méthode
    const c = val.contact;
    switch (val.contactMethod) {
      case 'email': {
        const r = z.email().safeParse(c);
        if (!r.success) {
          ctx.addIssue({ code: 'custom', path: ['contact'], message: 'Invalid email' });
        }
        break;
      }
      case 'wechat': {
        const re = /^[A-Za-z][-_A-Za-z0-9]{5,19}$/;
        if (!re.test(c)) {
          ctx.addIssue({
            code: 'custom',
            path: ['contact'],
            message: 'Invalid WeChat ID (6–20 chars, start with a letter, letters/digits/_/-)',
          });
        }
        break;
      }
      case 'instagram': {
        const re = /^(?!.*\.\.)(?!.*\.$)[A-Za-z0-9._]{1,30}$/;
        if (!re.test(c)) {
          ctx.addIssue({
            code: 'custom',
            path: ['contact'],
            message: 'Invalid Instagram handle (letters/numbers . _ , 1–30 chars)',
          });
        }
        break;
      }
      case 'phone': {
        const stripped = stripPhone(c);
        const re = /^\+?[1-9]\d{7,14}$/;
        if (!re.test(stripped)) {
          ctx.addIssue({
            code: 'custom',
            path: ['contact'],
            message: 'Invalid phone (use international format, e.g. +15551234567)',
          });
        }
        break;
      }
    }

    // 3) au moins un équipement
    const anyEquip =
      val.equipCanonIxus980is ||
      val.equipHpCcd ||
      val.equipIphoneX ||
      val.equipIphone13 ||
      val.equipNikonDslr;

    if (!anyEquip) {
      ctx.addIssue({
        code: 'custom',
        path: ['equipCanonIxus980is'],
        message: 'Select at least one equipment',
      });
    }

    // 4) règles add-on DSLR (inchangées)
    const hasCCDorPhone =
      val.equipCanonIxus980is || val.equipHpCcd || val.equipIphoneX || val.equipIphone13;
    const hasDSLR = val.equipNikonDslr;

    const duration = val.end.getTime() - val.start.getTime();

    if (hasDSLR && hasCCDorPhone && msToH(duration).hours < 2) {
      if (val.dslrAddonPhotos == null) {
        ctx.addIssue({
          code: 'custom',
          path: ['dslrAddonPhotos'],
          message: 'Please set DSLR add-on photos (min 3) when mixing DSLR with CCD/Phone',
        });
      }
    } else if (val.dslrAddonPhotos != null) {
      ctx.addIssue({
        code: 'custom',
        path: ['dslrAddonPhotos'],
        message: 'DSLR add-on is only allowed when DSLR is combined with CCD/Phone',
      });
    }
  })
  .transform((v) => {
    let contact = v.contact;
    if (v.contactMethod === 'instagram' || v.contactMethod === 'wechat') {
      contact = contact.toLowerCase();
    }
    if (v.contactMethod === 'phone') {
      contact = stripPhone(contact);
    }
    return { ...v, contact };
  });

export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
