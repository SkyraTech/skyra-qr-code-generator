import { Injectable } from '@nestjs/common';
import {
  HealthCheckResponse,
  PROJECT_CODENAME,
  PARENT_COMPANY,
  COMMERCIAL_PRODUCT_NAME,
  SystemInfo,
} from '@skyra/shared';

@Injectable()
export class HealthService {
  private readonly startTime = Date.now();

  getHealth(): HealthCheckResponse {
    return {
      status: 'ok',
      service: 'skyra-api',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      checks: {
        api: 'ok',
        database: 'pending', // Supabase integration in subsequent phase
        redis: 'pending',    // Deferred as per architecture
      },
    };
  }

  getLiveness(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  getReadiness(): HealthCheckResponse {
    return this.getHealth();
  }

  getSystemInfo(): SystemInfo {
    return {
      codename: PROJECT_CODENAME,
      parentCompany: PARENT_COMPANY,
      apiVersion: 'v1',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
