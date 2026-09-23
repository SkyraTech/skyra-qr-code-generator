import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errorType = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        message = exceptionResponse.message || exception.message;
        errorType = exceptionResponse.error || exception.name;
      }
    } else if (exception instanceof Error) {
      // Log unexpected errors securely without leaking stacks to the client
      this.logger.error(
        `[${request.method}] ${request.url} - ${exception.message}`,
        exception.stack,
      );
      message = 'An unexpected error occurred';
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: Array.isArray(message) ? message : [message],
      error: errorType,
    };

    if (status >= 500) {
      this.logger.error(`Critical Exception: ${JSON.stringify(errorResponse)}`);
    }

    response.status(status).send(errorResponse);
  }
}
