/**
 * SkyraQR Shared TypeScript Types
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    requestId?: string;
    timestamp: string;
  };
}

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'error';
  service: string;
  version: string;
  environment: string;
  timestamp: string;
  uptimeSeconds: number;
  checks: {
    api: 'ok' | 'error';
    database?: 'ok' | 'error' | 'pending';
    redis?: 'ok' | 'error' | 'pending';
  };
}

export interface SystemInfo {
  codename: string;
  parentCompany: string;
  apiVersion: string;
  environment: string;
}
