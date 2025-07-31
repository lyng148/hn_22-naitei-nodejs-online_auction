import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  TokenPayload,
  TokenPayloadInput,
} from '@common/types/token-payload.interface';
import * as jwt from 'jsonwebtoken';
import {
  ERROR_ACCESS_TOKEN_EXPIRED,
  ERROR_INVALID_ACCESS_TOKEN,
  ERROR_UNKNOWN_ACCESS_TOKEN,
  ERROR_REFRESH_TOKEN_EXPIRED,
  ERROR_INVALID_REFRESH_TOKEN,
  ERROR_UNKNOWN_REFRESH_TOKEN,
} from '@common/constants/error.constant';

@Injectable()
export default class TokenService {
  private readonly accessTokenKey = process.env.ACCESS_TOKEN_KEY;
  private readonly accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES;
  private readonly refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
  private readonly refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES;

  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(payload: TokenPayloadInput): Promise<string> {
    try {
      return await this.jwtService.signAsync(payload, {
        secret: this.accessTokenKey,
        expiresIn: this.accessTokenExpiresIn,
        algorithm: 'HS256',
      });
    } catch {
      throw new Error('Failed to generate access token');
    }
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      return await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.accessTokenKey,
        algorithms: ['HS256'],
      });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException(ERROR_ACCESS_TOKEN_EXPIRED);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException(ERROR_INVALID_ACCESS_TOKEN);
      }
      throw new UnauthorizedException(ERROR_UNKNOWN_ACCESS_TOKEN);
    }
  }

  async generateRefreshToken(payload: TokenPayloadInput): Promise<string> {
    try {
      return await this.jwtService.signAsync(payload, {
        secret: this.refreshTokenKey,
        expiresIn: this.refreshTokenExpiresIn,
        algorithm: 'HS256',
      });
    } catch {
      throw new Error('Failed to generate refresh token');
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    try {
      return await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.refreshTokenKey,
        algorithms: ['HS256'],
      });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException(ERROR_REFRESH_TOKEN_EXPIRED);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException(ERROR_INVALID_REFRESH_TOKEN);
      }
      throw new UnauthorizedException(ERROR_UNKNOWN_REFRESH_TOKEN);
    }
  }
}
