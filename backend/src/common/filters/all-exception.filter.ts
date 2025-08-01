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
    
    // Safely extract error information
    let errorMessage: any = { message: ERROR_INTERNAL_SERVER.message };
    
    if (exception && typeof exception === 'object') {
      const ex = exception as any;
      errorMessage = {
        message: ex.message || ERROR_INTERNAL_SERVER.message,
        ...(ex.name && { name: ex.name }),
        ...(ex.code && { code: ex.code }),
        ...(ex.stack && process.env.NODE_ENV === 'development' && { stack: ex.stack }),
      };
    }

    response.status(status).json({
      ...errorMessage,
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
