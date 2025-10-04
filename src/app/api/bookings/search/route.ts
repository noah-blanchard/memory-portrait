import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types/api';
import { validateAuthentication } from '@/utils/auth';
import {
  createServerErrorResponse,
  createSuccessResponse,
} from '@/utils/response';
import { createServerClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface SearchParams {
  q?: string; // General search query
  status?: string; // Filter by status (comma-separated)
  client_name?: string; // Filter by client name
  contact?: string; // Filter by contact info
  location?: string; // Filter by location
  date_from?: string; // Filter by date range start
  date_to?: string; // Filter by date range end
  people_count?: string; // Filter by people count
  budget_min?: string; // Filter by minimum budget
  budget_max?: string; // Filter by maximum budget
  language?: string; // Filter by language
  sort_by?: string; // Sort field (created_at, starts_at, client_name, etc.)
  sort_order?: string; // Sort order (asc, desc)
  limit?: string; // Limit results
  offset?: string; // Offset for pagination
}

export async function GET(req: Request): Promise<NextResponse<ApiResponse<unknown>>> {
  const auth = await validateAuthentication();
  if (!auth.success) {
    return auth.response as NextResponse<ApiResponse<unknown>>;
  }

  try {
    const { searchParams } = new URL(req.url);
    const params: SearchParams = Object.fromEntries(searchParams.entries());

    const supabase = await createServerClient();
    
    // Build the query with filters
    let query = supabase
      .from('booking_requests')
      .select('*');

    // General search query
    if (params.q) {
      const searchTerm = params.q.trim();
      query = query.or(`client_name.ilike.%${searchTerm}%,contact.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`);
    }

    // Status filter
    if (params.status) {
      const statuses = params.status.split(',').map(s => s.trim()).filter(Boolean);
      if (statuses.length > 0) {
        query = query.in('status', statuses);
      }
    }

    // Client name filter
    if (params.client_name) {
      query = query.ilike('client_name', `%${params.client_name.trim()}%`);
    }

    // Contact filter
    if (params.contact) {
      query = query.ilike('contact', `%${params.contact.trim()}%`);
    }

    // Location filter
    if (params.location) {
      query = query.ilike('location', `%${params.location.trim()}%`);
    }

    // Date range filters
    if (params.date_from) {
      query = query.gte('starts_at', params.date_from);
    }
    if (params.date_to) {
      query = query.lte('starts_at', params.date_to);
    }

    // People count filter
    if (params.people_count) {
      const peopleCount = parseInt(params.people_count, 10);
      if (!isNaN(peopleCount)) {
        query = query.eq('people_count', peopleCount);
      }
    }

    // Budget range filters
    if (params.budget_min) {
      const budgetMin = parseInt(params.budget_min, 10);
      if (!isNaN(budgetMin)) {
        query = query.gte('budget_cents', budgetMin * 100); // Convert to cents
      }
    }
    if (params.budget_max) {
      const budgetMax = parseInt(params.budget_max, 10);
      if (!isNaN(budgetMax)) {
        query = query.lte('budget_cents', budgetMax * 100); // Convert to cents
      }
    }

    // Language filter
    if (params.language) {
      query = query.eq('language', params.language.trim());
    }

    // Sorting
    const sortBy = params.sort_by || 'created_at';
    const sortOrder = params.sort_order === 'asc';
    query = query.order(sortBy, { ascending: sortOrder });

    // Pagination
    const limit = params.limit ? parseInt(params.limit, 10) : 50;
    const offset = params.offset ? parseInt(params.offset, 10) : 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      return createServerErrorResponse(error.message);
    }

    // Group the results by status
    const bookings = data || [];
    const groupedData = {
      pending: bookings.filter((booking: Record<string, unknown>) => booking.status === 'pending'),
      reviewed: bookings.filter((booking: Record<string, unknown>) => booking.status === 'reviewed'),
      approved: bookings.filter((booking: Record<string, unknown>) => booking.status === 'approved'),
      rejected: bookings.filter((booking: Record<string, unknown>) => booking.status === 'rejected'),
      cancelled: bookings.filter((booking: Record<string, unknown>) => booking.status === 'cancelled'),
    };

    // Return the data directly without strict schema validation for now
    // This matches the format expected by the frontend
    return createSuccessResponse(groupedData, 200);
  } catch (e: unknown) {
    const error = e as Error;
    return createServerErrorResponse(error?.message ?? 'Unexpected error');
  }
}
