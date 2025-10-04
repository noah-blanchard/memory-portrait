import { NextResponse } from 'next/server';
import type {
  ApiErrorResponse,
  ApiResponseOptions,
  ApiSuccessResponse,
  HttpStatusCode,
} from '@/types/api';

export function createSuccessResponse<T>(
  data: T,
  status: HttpStatusCode = 200,
  options?: Omit<ApiResponseOptions, 'status'>
): NextResponse<ApiSuccessResponse<T>> {
  const response: ApiSuccessResponse<T> = {
    ok: true,
    data,
  };

  return NextResponse.json(response, {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...options?.headers,
    },
  });
}

export function createErrorResponse(
  error: ApiErrorResponse['error'],
  status: HttpStatusCode = 400,
  options?: Omit<ApiResponseOptions, 'status'>
): NextResponse<ApiErrorResponse> {
  const response: ApiErrorResponse = {
    ok: false,
    error,
  };

  return NextResponse.json(response, {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...options?.headers,
    },
  });
}

export function createValidationErrorResponse(
  issues: Array<{ path: string; message: string; code: string }>,
  message: string = 'Invalid request body'
): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    {
      code: 'validation_error',
      message,
      issues,
    },
    400
  );
}

export function createUnauthorizedResponse(
  message: string = 'Auth required'
): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    {
      code: 'unauthorized',
      message,
    },
    401
  );
}

export function createNotFoundResponse(message: string): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    {
      code: 'not_found',
      message,
    },
    404
  );
}

export function createServerErrorResponse(
  message: string = 'Unexpected error'
): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    {
      code: 'server_error',
      message,
    },
    500
  );
}

export function createRpcErrorResponse(message: string): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    {
      code: 'rpc_error',
      message,
    },
    500
  );
}

export function createInvalidContentTypeResponse(): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    {
      code: 'invalid_content_type',
      message: 'Expected application/json',
    },
    415
  );
}

export function createInvalidJsonResponse(): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    {
      code: 'invalid_json',
      message: 'Body must be valid JSON',
    },
    400
  );
}

export function createConstraintViolationResponse(message: string): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    {
      code: 'constraint_violation',
      message,
    },
    409
  );
}

export function createSlotUnavailableResponse(): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    {
      code: 'slot_unavailable',
      message: 'Requested slot is unavailable.',
    },
    409
  );
}
