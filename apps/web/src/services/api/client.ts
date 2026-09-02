import { ApiRequestOptions } from './types';
import { ApiError } from './errors';
import { siteConfig } from '@/config/site';

/**
 * Centralized API Client
 * Ensures that all frontend data fetching routes through an authoritative,
 * standardized boundary with interceptors, timeouts, and error handling.
 *
 * NOTE: Direct database or Supabase access from UI components is STRICTLY FORBIDDEN.
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = siteConfig.apiBaseUrl) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${cleanPath}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  async request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const { params, timeoutMs = 15000, headers, ...fetchOptions } = options;
    const url = this.buildUrl(path, params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...headers,
        },
        signal: controller.signal,
        credentials: 'include', // Includes HttpOnly session cookies
      });

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          // Non-JSON error response
        }
        throw new ApiError(response.status, errorData);
      }

      if (response.status === 204) {
        return undefined as unknown as T;
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      if (err instanceof ApiError) throw err;
      if (err instanceof Error && err.name === 'AbortError') {
        throw new ApiError(408, {
          code: 'REQUEST_TIMEOUT',
          message: 'The network request timed out',
        });
      }
      throw new ApiError(500, {
        code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'An unexpected network error occurred',
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(path: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(path: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
