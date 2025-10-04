export interface ApiSuccessResponse<T = unknown> {
  ok: true;
  data: T;
}

export interface ApiErrorResponse {
  ok: false;
  error: {
    code: string;
    message: string;
    issues?: Array<{
      path: string;
      message: string;
      code: string;
    }>;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface ApiError {
  code: string;
  message: string;
  issues?: Array<{
    path: string;
    message: string;
    code: string;
  }>;
}

export type HttpStatusCode =
  | 200
  | 201
  | 202
  | 204
  | 400
  | 401
  | 403
  | 404
  | 409
  | 415
  | 422
  | 500
  | 502
  | 503
  | 504;

export interface ApiResponseOptions {
  status: HttpStatusCode;
  headers?: Record<string, string>;
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email?: string;
  };
}

export interface ValidationIssue {
  path: string;
  message: string;
  code: string;
}

export interface ValidationError extends ApiError {
  code: 'validation_error';
  issues: ValidationIssue[];
}

export interface UnauthorizedError extends ApiError {
  code: 'unauthorized';
}

export interface NotFoundError extends ApiError {
  code: 'not_found';
}

export interface ServerError extends ApiError {
  code: 'server_error';
}

export interface RpcError extends ApiError {
  code: 'rpc_error';
}

export interface InvalidContentTypeError extends ApiError {
  code: 'invalid_content_type';
}

export interface InvalidJsonError extends ApiError {
  code: 'invalid_json';
}

export interface ConstraintViolationError extends ApiError {
  code: 'constraint_violation';
}

export interface SlotUnavailableError extends ApiError {
  code: 'slot_unavailable';
}

export type KnownApiError =
  | ValidationError
  | UnauthorizedError
  | NotFoundError
  | ServerError
  | RpcError
  | InvalidContentTypeError
  | InvalidJsonError
  | ConstraintViolationError
  | SlotUnavailableError;
