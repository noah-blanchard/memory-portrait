import { NextResponse } from 'next/server';
import { bookingStatusUpdateSchema } from '@/schemas/bookingStatusUpdate';
import type { ApiResponse } from '@/types/api';
import { validateAuthentication } from '@/utils/api/auth';
import {
  createNotFoundResponse,
  createRpcErrorResponse,
  createServerErrorResponse,
  createSuccessResponse,
} from '@/utils/api/response';
import { validateJsonRequest } from '@/utils/api/validation';
import { createServerClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(req: Request): Promise<
  NextResponse<
    ApiResponse<{
      request_uid: string;
      status: string;
      updated_at: string;
    }>
  >
> {
  const validation = await validateJsonRequest(req, bookingStatusUpdateSchema);
  if (!validation.success) {
    return validation.response as NextResponse<
      ApiResponse<{
        request_uid: string;
        status: string;
        updated_at: string;
      }>
    >;
  }

  const auth = await validateAuthentication();
  if (!auth.success) {
    return auth.response as NextResponse<
      ApiResponse<{
        request_uid: string;
        status: string;
        updated_at: string;
      }>
    >;
  }

  try {
    const supabase = await createServerClient();
    const { requestUid, status } = validation.data;

    const { data, error } = await supabase.rpc('set_booking_status', {
      p_request_uid: requestUid,
      p_status: status,
    });

    if (error) {
      return createRpcErrorResponse(error.message);
    }

    if (!data) {
      return createNotFoundResponse(`Booking not found for request_uid=${requestUid}`);
    }

    return createSuccessResponse(
      {
        request_uid: data.request_uid,
        status: data.status,
        updated_at: data.updated_at,
      },
      200
    );
  } catch (e: any) {
    return createServerErrorResponse(e?.message ?? 'Unexpected error');
  }
}
