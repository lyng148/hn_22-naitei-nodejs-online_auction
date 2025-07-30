import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import PrismaService from '@common/services/prisma.service';
import { RegisterBodyDto } from './dtos/register.body.dto';
import { User, Role } from '.prisma/client';
import TokenService from '@common/services/token.service';
import PasswordService from '@common/services/password.service';
import { RegisterResponseDto } from './dtos/register.response.dto';
import {
  ERROR_EMAIL_ALREADY_EXISTS,
  ERROR_INVALID_CREDENTIALS,
} from '@common/constants/error.constant';
import { LoginResponseDto } from './dtos/login.response.dto';
import { LoginBodyDto } from './dtos/login.body.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private passwordService: PasswordService,
  ) {}

  async register(data: RegisterBodyDto): Promise<RegisterResponseDto> {
    const emailExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (emailExists) {
      throw new ConflictException(ERROR_EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await this.passwordService.hashPassword(
      data.password,
    );
    let role: Role = Role.BIDDER;
    if (data.isSeller) {
      role = Role.SELLER;
    }
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: role,
      },
    });

    return this.buildUserResponse(user);
  }

  async login(data: LoginBodyDto): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (
      !user ||
      !(await this.passwordService.comparePassword(
        data.password,
        user.password,
      ))
    ) {
      throw new UnauthorizedException(ERROR_INVALID_CREDENTIALS);
    }

    return this.buildUserResponse(user);
  }

  private async buildUserResponse(user: User): Promise<RegisterResponseDto> {
    const payload = {
      id: user.userId,
      email: user.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(payload),
      this.tokenService.generateRefreshToken(payload),
    ]);

    return {
      user: {
        id: user.userId,
        email: user.email,
        accessToken,
        refreshToken,
      },
    };
  }
}
