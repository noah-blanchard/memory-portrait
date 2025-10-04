import { NextResponse } from 'next/server';
import { sendMail } from '@/lib/email';
import { bookingCreateSchema, bookingGroupedSchema } from '@/schemas/booking';
import type { ApiResponse } from '@/types/api';
import { validateAuthentication } from '@/utils/auth';
import {
  createConstraintViolationResponse,
  createRpcErrorResponse,
  createServerErrorResponse,
  createSlotUnavailableResponse,
  createSuccessResponse,
} from '@/utils/response';
import { validateJsonRequest } from '@/utils/validation';
import { createServerClient } from '@/utils/supabase/server';
import { createBookingArgs } from './helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request): Promise<NextResponse<ApiResponse<unknown>>> {
  const validation = await validateJsonRequest(req, bookingCreateSchema);
  if (!validation.success) {
    return validation.response as NextResponse<ApiResponse<unknown>>;
  }

  const args = createBookingArgs(validation.data);

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase.rpc('create_booking_request', args as any);

    if (error) {
      const code = (error.code || '').toLowerCase();
      const msg = error.message || 'Database error';

      if (msg.toLowerCase().includes('overlaps an unavailable period')) {
        return createSlotUnavailableResponse();
      }
      if (['22007', '22023', '22003'].includes(code) || /must be|invalid/i.test(msg)) {
        return createServerErrorResponse(msg);
      }
      if (code === '23514' || code === 'check_violation') {
        return createConstraintViolationResponse(msg);
      }
      return createRpcErrorResponse(msg);
    }

    try {
      const r = data as Record<string, unknown>;
      const d = validation.data;

      const tz = 'America/Toronto';
      const fmt = (dateLike: string | Date | undefined | null) => {
        if (!dateLike) {
          return 'N/A';
        }
        const dt = typeof dateLike === 'string' ? new Date(dateLike) : dateLike;
        return new Intl.DateTimeFormat('en-CA', {
          timeZone: tz,
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZoneName: 'short',
        }).format(dt);
      };

      const money = (cents?: number | null) => {
        if (cents == null) {
          return 'N/A';
        }
        return `$${(cents / 100).toFixed(2)} CAD`;
      };

      const clientName = (r?.client_name as string) ?? d.clientName;
      const photoshootKind = (r?.photoshoot_kind as string) ?? d.photoshootKind;
      const startsAt = (r?.starts_at as string) ?? d.start;
      const endsAt = (r?.ends_at as string) ?? d.end;
      const location = (r?.location as string) ?? d.location ?? null;
      const peopleCount = (r?.people_count as number) ?? d.peopleCount;
      const language = (r?.language as string) ?? d.language ?? null;
      const budgetCents = (r?.budget_cents as number) ?? null;
      const notes = (r?.notes as string) ?? d.notes ?? null;
      const contactMethod = (r?.contact_method as string) ?? d.contactMethod;
      const contact = (r?.contact as string) ?? d.contact;

      const hasCanonIxus = (r?.has_ccd_canon_ixus980is as boolean) ?? d.equipCanonIxus980is ?? false;
      const hasHpCcd = (r?.has_ccd_hp as boolean) ?? d.equipHpCcd ?? false;
      const hasIphoneX = (r?.has_phone_iphone_x as boolean) ?? d.equipIphoneX ?? false;
      const hasIphone13 = (r?.has_phone_iphone_13 as boolean) ?? d.equipIphone13 ?? false;
      const hasNikonDslr = (r?.has_dslr_nikon as boolean) ?? d.equipNikonDslr ?? false;
      const dslrAddonPhotos = (r?.dslr_addon_photos as number) ?? d.dslrAddonPhotos ?? null;
      const extraEdits = (r?.extra_edits as number) ?? d.extraEdits ?? 0;

      const equipments: string[] = [];
      if (hasCanonIxus) {
        equipments.push('CCD Canon IXUS 980 IS');
      }
      if (hasHpCcd) {
        equipments.push('CCD HP');
      }
      if (hasIphoneX) {
        equipments.push('iPhone X');
      }
      if (hasIphone13) {
        equipments.push('iPhone 13');
      }
      if (hasNikonDslr) {
        equipments.push('Nikon DSLR');
      }
      const equipmentsStr = equipments.length ? equipments.join(', ') : 'None';

      const subject = `New photoshoot request — ${clientName} (${photoshootKind})`;

      const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;line-height:1.45">
    <h2 style="margin:0 0 12px">New photoshoot request 📸</h2>
    <p style="margin:0 0 12px;color:#444">
      <b>Created:</b> ${fmt(new Date())}
    </p>

    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:720px">
      <tbody>
        <tr>
          <td style="border-top:1px solid #eee"><b>Client</b></td>
          <td style="border-top:1px solid #eee">${clientName}</td>
        </tr>
        <tr>
          <td><b>Contact</b></td>
          <td>${contact} <span style="color:#666">(${contactMethod})</span></td>
        </tr>
        <tr>
          <td><b>Photoshoot kind</b></td>
          <td>${photoshootKind}</td>
        </tr>
        <tr>
          <td><b>Period (Montreal)</b></td>
          <td>${fmt(startsAt)} → ${fmt(endsAt)}</td>
        </tr>
        <tr>
          <td><b>Location</b></td>
          <td>${location ?? 'N/A'}</td>
        </tr>
        <tr>
          <td><b>People count</b></td>
          <td>${peopleCount}</td>
        </tr>
        <tr>
          <td><b>Language</b></td>
          <td>${language ?? 'N/A'}</td>
        </tr>
        <tr>
          <td><b>Budget</b></td>
          <td>${money(budgetCents)}</td>
        </tr>
        <tr>
          <td><b>Equipments to bring</b></td>
          <td>
            ${equipmentsStr}
            ${
              hasNikonDslr || dslrAddonPhotos
                ? `<div style="color:#444;margin-top:4px">
              DSLR add-on photos: <b>${dslrAddonPhotos ?? 'N/A'}</b>
            </div>`
                : ''
            }
          </td>
        </tr>
        <tr>
          <td><b>Extra edits</b></td>
          <td>${extraEdits}</td>
        </tr>
        <tr>
          <td style="vertical-align:top"><b>Notes</b></td>
          <td>${notes ? (notes as string).replace(/\n/g, '<br/>') : '—'}</td>
        </tr>
      </tbody>
    </table>

    <p style="margin-top:16px;color:#666;font-size:12px">
      Time zone: America/Toronto (Montreal). Values show local time with DST (EST/EDT).
    </p>
  </div>`;

      await sendMail({
        to: process.env.ADMIN_NOTIFY_EMAIL!,
        subject,
        html,
        fromName: 'Memory Booking Platform',
      });
    } catch (mailErr) {
      // Email sending failed, but booking was created successfully
    }

    return createSuccessResponse(data, 201);
  } catch (e: unknown) {
    const error = e as Error;
    return createServerErrorResponse(error?.message ?? 'Unexpected error');
  }
}

export async function GET(): Promise<NextResponse<ApiResponse<unknown>>> {
  const auth = await validateAuthentication();
  if (!auth.success) {
    return auth.response as NextResponse<ApiResponse<unknown>>;
  }

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase.rpc('booking_requests_grouped_by_status');

    if (error) {
      return createRpcErrorResponse(error.message);
    }

    const parsed = bookingGroupedSchema.safeParse(data);
    if (!parsed.success) {
      return createServerErrorResponse('Invalid payload from database');
    }

    return createSuccessResponse(parsed.data, 200);
  } catch (e: unknown) {
    const error = e as Error;
    return createServerErrorResponse(error?.message ?? 'Unexpected error');
  }
}
