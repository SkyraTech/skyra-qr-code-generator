import { Injectable } from '@nestjs/common';
import {
  HealthCheckResponse,
  PROJECT_CODENAME,
  PARENT_COMPANY,
  SystemInfo,
} from '@skyra/shared';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HealthService {
  private readonly startTime = Date.now();

  constructor(private readonly databaseService: DatabaseService) {}

  async getHealth(): Promise<HealthCheckResponse> {
    const isDbHealthy = await this.databaseService.ping();

    return {
      status: isDbHealthy ? 'ok' : 'degraded',
      service: 'skyra-api',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      checks: {
        api: 'ok',
        database: isDbHealthy ? 'ok' : 'error',
        redis: 'pending', // Deferred as per architecture
      },
    };
  }

  getLiveness(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  async getReadiness(): Promise<HealthCheckResponse> {
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
