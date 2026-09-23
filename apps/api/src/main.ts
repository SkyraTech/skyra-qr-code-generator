import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DEFAULT_API_PORT, PROJECT_CODENAME } from '@skyra/shared';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger(`${PROJECT_CODENAME}-API`);

  const fastifyAdapter = new FastifyAdapter({
    logger: process.env.NODE_ENV !== 'production',
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );

  // Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global Transform Interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configure CORS for frontend access
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin.includes(',') ? corsOrigin.split(',') : corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Skyra-Signature'],
  });

  // Global prefix with health check endpoints excluded from prefix
  app.setGlobalPrefix('api/v1', {
    exclude: ['health', 'health/(.*)'],
  });

  const port = parseInt(process.env.PORT || `${DEFAULT_API_PORT}`, 10);
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);
  logger.log(`🚀 ${PROJECT_CODENAME} Authoritative API running on http://${host}:${port}`);
  logger.log(`🩺 Health check available at http://${host}:${port}/health/liveness`);
  logger.log(`🩺 Readiness probe available at http://${host}:${port}/health/readiness`);
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap error in SkyraQR API:', err);
  process.exit(1);
});
