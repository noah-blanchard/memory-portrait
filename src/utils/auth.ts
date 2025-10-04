import { NextResponse } from 'next/server';
import type { ApiErrorResponse } from '@/types/api';
import { createServerClient } from '@/utils/supabase/server';
import { createUnauthorizedResponse } from './response';

export interface AuthenticatedUser {
  id: string;
  email?: string;
}

export interface AuthSuccess {
  success: true;
  user: AuthenticatedUser;
}

export interface AuthFailure {
  success: false;
  response: NextResponse<ApiErrorResponse>;
}

export type AuthResult = AuthSuccess | AuthFailure;

export async function validateAuthentication(): Promise<AuthResult> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        response: createUnauthorizedResponse(),
      };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  } catch (error) {
    return {
      success: false,
      response: createUnauthorizedResponse(),
    };
  }
}
