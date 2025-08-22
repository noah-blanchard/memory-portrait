// src/schemas/booking.ts
import { z } from 'zod';
import { ContactMethodEnum, PhotoshootTypeEnum } from './enums';
import { normalizeWhitespace, stripPhone } from './helpers';

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
  })
  .superRefine((val, ctx) => {
    if (val.start.getTime() >= val.end.getTime()) {
      ctx.addIssue({
        code: 'custom',
        path: ['end'],
        message: 'End must be after start',
      });
    }

    const c = val.contact;
    switch (val.contactMethod) {
      case 'email': {
        const email = z.email();
        const r = email.safeParse(c);
        if (!r.success) {
          ctx.addIssue({
            code: 'custom',
            path: ['contact'],
            message: 'Invalid email',
          });
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
