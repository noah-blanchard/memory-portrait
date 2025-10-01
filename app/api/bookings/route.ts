import { NextResponse } from 'next/server';
import { sendMail } from '@/lib/email';
import { bookingCreateSchema } from '@/schemas/bookingCreate';
import { bookingGroupedSchema } from '@/schemas/bookingGrouped';
import { json } from '@/utils/api/helpers';
import { createServerClient } from '@/utils/supabase/server';
import { createBookingArgs } from './helpers';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const ct = req.headers.get('content-type') ?? '';
  if (!ct.includes('application/json')) {
    return json(
      { ok: false, error: { code: 'invalid_content_type', message: 'Expected application/json' } },
      415
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json(
      { ok: false, error: { code: 'invalid_json', message: 'Body must be valid JSON' } },
      400
    );
  }

  const parsed = bookingCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        error: {
          code: 'validation_error',
          message: 'Invalid request body',
          issues: parsed.error.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
            code: i.code,
          })),
        },
      },
      400
    );
  }

  const args = createBookingArgs(parsed.data);

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase.rpc('create_booking_request', args);

    if (error) {
      const code = (error.code || '').toLowerCase();
      const msg = error.message || 'Database error';

      if (msg.toLowerCase().includes('overlaps an unavailable period')) {
        return json(
          {
            ok: false,
            error: { code: 'slot_unavailable', message: 'Requested slot is unavailable.' },
          },
          409
        );
      }
      if (['22007', '22023', '22003'].includes(code) || /must be|invalid/i.test(msg)) {
        return json({ ok: false, error: { code: 'bad_request', message: msg } }, 400);
      }
      if (code === '23514' || code === 'check_violation') {
        return json({ ok: false, error: { code: 'constraint_violation', message: msg } }, 409);
      }
      return json({ ok: false, error: { code: 'rpc_error', message: msg } }, 500);
    }

    try {
      const r = data as any; // ce que renvoie ta RPC (idéalement la ligne insérée)
      const d = parsed.data;

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

      const clientName = r?.client_name ?? d.clientName;
      const photoshootKind = r?.photoshoot_kind ?? d.photoshootKind;
      const startsAt = r?.starts_at ?? d.start;
      const endsAt = r?.ends_at ?? d.end;
      const location = r?.location ?? d.location ?? null;
      const peopleCount = r?.people_count ?? d.peopleCount;
      const language = r?.language ?? d.language ?? null;
      const budgetCents = r?.budget_cents ?? null;
      const notes = r?.notes ?? d.notes ?? null;
      const contactMethod = r?.contact_method ?? d.contactMethod;
      const contact = r?.contact ?? d.contact;

      const hasCanonIxus = r?.has_ccd_canon_ixus980is ?? d.equipCanonIxus980is ?? false;
      const hasHpCcd = r?.has_ccd_hp ?? d.equipHpCcd ?? false;
      const hasIphoneX = r?.has_phone_iphone_x ?? d.equipIphoneX ?? false;
      const hasIphone13 = r?.has_phone_iphone_13 ?? d.equipIphone13 ?? false;
      const hasNikonDslr = r?.has_dslr_nikon ?? d.equipNikonDslr ?? false;
      const dslrAddonPhotos = r?.dslr_addon_photos ?? d.dslrAddonPhotos ?? null;
      const extraEdits = r?.extra_edits ?? d.extraEdits ?? 0;

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
          <td>${notes ? notes.replace(/\n/g, '<br/>') : '—'}</td>
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
    }

    return json({ ok: true, data }, 201);
  } catch (e: any) {
    return json(
      { ok: false, error: { code: 'server_error', message: e?.message ?? 'Unexpected error' } },
      500
    );
  }
}

export async function GET() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { ok: false, error: { code: 'unauthorized', message: 'Auth required' } },
      { status: 401 }
    );
  }

  const { data, error } = await supabase.rpc('booking_requests_grouped_by_status');

  if (error) {
    return NextResponse.json(
      { ok: false, error: { code: 'rpc_error', message: error.message } },
      { status: 500 }
    );
  }

  const parsed = bookingGroupedSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'invalid_payload',
          message: 'Invalid payload from database',
          issues: parsed.error.issues,
        },
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, data: parsed.data }, { status: 200 });
}
