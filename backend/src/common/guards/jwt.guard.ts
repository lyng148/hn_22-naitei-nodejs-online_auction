import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import TokenService from '@common/services/token.service';
import { Reflector } from '@nestjs/core';
import { ERROR_MISSING_AUTH_HEADER } from '@common/constants/error.constant';
import { Request } from 'express';
import { AUTH_TYPE_KEY } from '@common/decorators/auth.decorator';
import { AuthType } from '@common/types/auth-type.enum';

@Injectable()
export default class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authType: AuthType =
      this.reflector.get<AuthType>(AUTH_TYPE_KEY, context.getHandler()) ??
      AuthType.ACCESS_TOKEN;

    if (authType === AuthType.NONE) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(ERROR_MISSING_AUTH_HEADER);
    }

    const token = authHeader.split(' ')[1];
    request['user'] = await this.tokenService.verifyAccessToken(token);
    return true;
  }
}
