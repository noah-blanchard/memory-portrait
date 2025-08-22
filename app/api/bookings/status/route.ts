import { NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { bookingStatusUpdateSchema } from '@/schemas/bookingStatusUpdate';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(req: Request) {
  // ---- Auth check
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

  // ---- Parse & validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: 'bad_request', message: 'JSON body required' } },
      { status: 400 }
    );
  }

  const parsed = bookingStatusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'invalid_payload',
          message: 'Invalid payload',
          issues: parsed.error.issues,
        },
      },
      { status: 400 }
    );
  }

  const { requestUid, status } = parsed.data;

  // ---- RPC
  const { data, error } = await supabase.rpc('set_booking_status', {
    p_request_uid: requestUid,
    p_status: status,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: { code: 'rpc_error', message: error.message } },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'not_found',
          message: `Booking not found for request_uid=${requestUid}`,
        },
      },
      { status: 404 }
    );
  }

  // Renvoie la ligne mise à jour (tu peux réduire si tu veux)
  return NextResponse.json(
    {
      ok: true,
      data: {
        request_uid: data.request_uid,
        status: data.status,
        updated_at: data.updated_at,
      },
    },
    { status: 200 }
  );
}
