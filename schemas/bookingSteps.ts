import { z } from "zod";
import {
  bookingCreateSchema,
  type BookingCreateInput,
} from "./bookingCreate";
import { ContactMethodEnum, PhotoshootTypeEnum } from "./enums";

/* --- mêmes petits helpers que dans bookingCreate --- */
const normalizeWhitespace = (s: string) => s.replace(/\s+/g, " ").trim();
const stripPhone = (s: string) => s.replace(/[^\d+]/g, "");

/* --- validation contact (réutilisable) --- */
function validateContactForMethod(
  method: BookingCreateInput["contactMethod"],
  contact: string,
  ctx: z.RefinementCtx,
  path: (string | number)[] = ["contact"]
) {
  switch (method) {
    case "email": {
      if (!z.string().email().safeParse(contact).success) {
        ctx.addIssue({ code: "custom", path, message: "Invalid email" });
      }
      break;
    }
    case "wechat": {
      const re = /^[A-Za-z][-_A-Za-z0-9]{5,19}$/;
      if (!re.test(contact)) {
        ctx.addIssue({
          code: "custom",
          path,
          message:
            "Invalid WeChat ID (6–20 chars, start with a letter, letters/digits/_/-)",
        });
      }
      break;
    }
    case "instagram": {
      const re = /^(?!.*\.\.)(?!.*\.$)[A-Za-z0-9._]{1,30}$/;
      if (!re.test(contact)) {
        ctx.addIssue({
          code: "custom",
          path,
          message:
            "Invalid Instagram handle (letters/numbers . _ , 1–30 chars)",
        });
      }
      break;
    }
    case "phone": {
      const stripped = stripPhone(contact);
      const re = /^\+?[1-9]\d{7,14}$/;
      if (!re.test(stripped)) {
        ctx.addIssue({
          code: "custom",
          path,
          message:
            "Invalid phone (use international format, e.g. +15551234567)",
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
    clientName: z
      .string()
      .min(1)
      .max(120)
      .transform(normalizeWhitespace),
    contactMethod: ContactMethodEnum,
    contact: z
      .string()
      .min(1, "Contact is required")
      .max(120)
      .transform(normalizeWhitespace),
  })
  .superRefine((val, ctx) => {
    validateContactForMethod(val.contactMethod, val.contact, ctx);
  });

/** Step 2: photoshoot type + location (ville au Québec) */
export const step2Schema = z.object({
    photoshootKind: PhotoshootTypeEnum,
    location: z
      .string()
      .min(2, "Please enter a city in Quebec")
      .max(200)
      .transform(normalizeWhitespace),
});

/** Step 3: date + time (HH:mm) + duration (1..3h) */
export const step3Schema = z.object({
  date: z.coerce.date(),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Pick a time (HH:mm)"),
  durationHours: z.number().int().min(1).max(3),
});

export type Step1 = z.infer<typeof step1Schema>;
export type Step2 = z.infer<typeof step2Schema>;
export type Step3 = z.infer<typeof step3Schema>;

/* ===================== COMPOSITION FINALE ===================== */

function mergeDateTime(d: Date, hhmm: string): Date {
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  const out = new Date(d);
  out.setHours(h, m, 0, 0);
  return out;
}

/** Construit l'objet final attendu par bookingCreateSchema, puis safeParse */
export function buildAndValidateBooking(
  s1: Step1,
  s2: Step2,
  s3: Step3
) {
  const start = mergeDateTime(s3.date, s3.time);
  const end = new Date(start.getTime() + s3.durationHours * 60 * 60 * 1000);

  const candidate: BookingCreateInput = {
    clientName: s1.clientName,
    contactMethod: s1.contactMethod,
    contact: s1.contact,
    photoshootKind: s2.photoshootKind,
    start,
    end,
    location: s2.location,      // optionnel dans le schéma final, ici rempli
    peopleCount: 1,             // valeur par défaut souhaitée
    language: "undefined",
    notes: "undefined",
  };

  // Validation/normalisation finale (transforms + cross-field checks)
  return bookingCreateSchema.safeParse(candidate);
}

/** (optionnel) aide pour router les erreurs du schéma final vers les steps */
export function splitFinalIssuesByStep(issues: z.ZodIssue[]) {
  const s1: Record<string, string> = {};
  const s2: Record<string, string> = {};
  const s3: Record<string, string> = {};

  for (const i of issues) {
    const key = i.path.join(".");
    const msg = i.message;
    if (key.startsWith("clientName") || key.startsWith("contact")) s1[key] = msg;
    else if (key.startsWith("photoshootKind") || key.startsWith("location")) s2[key] = msg;
    else if (key === "start" || key === "end") s3.time = msg; // mappe sur time/duration
  }
  return { s1, s2, s3 };
}
