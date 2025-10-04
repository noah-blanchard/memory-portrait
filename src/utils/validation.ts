import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { ApiErrorResponse } from '@/types/api';
import {
  createInvalidContentTypeResponse,
  createInvalidJsonResponse,
  createValidationErrorResponse,
} from './response';

export interface ValidationSuccess<T> {
  success: true;
  data: T;
}

export interface ValidationFailure {
  success: false;
  response: NextResponse<ApiErrorResponse>;
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export async function validateJsonRequest<T>(
  req: Request,
  schema: z.ZodSchema<T>
): Promise<ValidationResult<T>> {
  const contentType = req.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    return {
      success: false,
      response: createInvalidContentTypeResponse(),
    };
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return {
      success: false,
      response: createInvalidJsonResponse(),
    };
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));

    return {
      success: false,
      response: createValidationErrorResponse(issues),
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
}

export function validateZodIssues(issues: z.ZodIssue[]): Array<{
  path: string;
  message: string;
  code: string;
}> {
  return issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));
}
