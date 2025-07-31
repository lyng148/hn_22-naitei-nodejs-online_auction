import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ERROR_INTERNAL_SERVER } from '@common/constants/error.constant';

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const errorMessage =
      typeof response === 'object'
        ? response
        : { message: ERROR_INTERNAL_SERVER.message };

    response.status(status).json({
      ...errorMessage,
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
