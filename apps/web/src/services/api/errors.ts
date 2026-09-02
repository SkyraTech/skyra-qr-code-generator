import { ApiErrorPayload } from './types';

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(status: number, payload?: Partial<ApiErrorPayload>) {
    super(payload?.message || `API Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.code = payload?.code || 'UNKNOWN_ERROR';
    this.details = payload?.details;
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }
}
