import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthCheckResponse, SystemInfo } from '@skyra/shared';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(): HealthCheckResponse {
    return this.healthService.getHealth();
  }

  @Get('liveness')
  getLiveness(): { status: string; timestamp: string } {
    return this.healthService.getLiveness();
  }

  @Get('readiness')
  getReadiness(): HealthCheckResponse {
    return this.healthService.getReadiness();
  }

  @Get('info')
  getSystemInfo(): SystemInfo {
    return this.healthService.getSystemInfo();
  }
}
