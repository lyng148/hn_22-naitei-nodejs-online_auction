import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import PrismaService from '@common/services/prisma.service';
import { RegisterBodyDto } from './dtos/register.body.dto';
import { User, Role } from '.prisma/client';
import TokenService from '@common/services/token.service';
import PasswordService from '@common/services/password.service';
import { RegisterResponseDto } from './dtos/register.response.dto';
import {
  ERROR_BAD_REQUEST,
  ERROR_CHANGE_PASSWORD_FAILED,
  ERROR_EMAIL_ALREADY_EXISTS,
  ERROR_INCORRECT_CURRENT_PASSWORD,
  ERROR_INVALID_CREDENTIALS,
  ERROR_USER_NOT_FOUND,
} from '@common/constants/error.constant';
import { LoginResponseDto } from './dtos/login.response.dto';
import { LoginBodyDto } from './dtos/login.body.dto';
import { ChangePasswordBodyDto } from './dtos/changePassword.dto';
import { ChangePasswordResponseDto } from './dtos/changePasswordResponse.dto';
import { RefreshTokenDto } from './dtos/refresh-token.body.dto';
import { RefreshTokenResponseDto } from './dtos/refresh-token.response.dto';
import { ForgotPasswordResponseDto } from './dtos/forgot-password.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private passwordService: PasswordService,
    private mailerService: MailerService,
  ) { }

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

    const user = await this.prisma.$transaction(async (prisma) => {
      const newUser = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: role,
        },
      });

      if (data.fullName && data.fullName.trim()) {
        await prisma.profile.create({
          data: {
            userId: newUser.userId,
            fullName: data.fullName.trim(),
          },
        });
      }

      return newUser;
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

  async changePassword(
    userId: string,
    data: ChangePasswordBodyDto,
  ): Promise<ChangePasswordResponseDto> {

    const user = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_USER_NOT_FOUND);
    }

    const isCurrentPasswordValid = await this.passwordService.comparePassword(
      data.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException(ERROR_INCORRECT_CURRENT_PASSWORD);
    }

    const hashedNewPassword = await this.passwordService.hashPassword(
      data.newPassword,
    );

    try {
      await this.prisma.user.update({
        where: { userId },
        data: {
          password: hashedNewPassword,
          updatedAt: new Date(),
        },
      });

      return {
        userId: userId,
        message: 'Password changed successfully',
      };
    } catch (error) {
      throw new BadRequestException(ERROR_CHANGE_PASSWORD_FAILED);
    }
  }

  async refreshToken(data: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    const payload = await this.tokenService.verifyRefreshToken(data.refreshToken);
    if (!payload) throw new UnauthorizedException(ERROR_INVALID_CREDENTIALS);

    const user = await this.prisma.user.findUnique({
      where: { userId: payload.id },
    });

    if (!user) throw new UnauthorizedException(ERROR_USER_NOT_FOUND);

    const newPayload = {
      id: user.userId,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(newPayload),
      this.tokenService.generateRefreshToken(newPayload),
    ]);

    return { accessToken, refreshToken };
  }

  private async buildUserResponse(user: User): Promise<RegisterResponseDto> {
    const payload = {
      id: user.userId,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(payload),
      this.tokenService.generateRefreshToken(payload),
    ]);

    return {
      user: {
        id: user.userId,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken,
      },
    };
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponseDto> {
    if (!email) {
      throw new BadRequestException(ERROR_BAD_REQUEST);
    }
    
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      throw new BadRequestException(ERROR_USER_NOT_FOUND);
    }

    // Tạo reset token (có thể dùng JWT hoặc random string)
    const resetToken = await this.tokenService.generateAccessToken({
      id: user.userId,
      email: user.email,
      role: user.role,
    });

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset password',
      template: 'reset', // nếu dùng template
      context: {
        url: 'http://localhost:5173/reset?token=' + resetToken,
        userName: user.email, // hoặc user.profile?.fullName nếu có
      },
    });

    return {
      email: user.email,
      message: 'Reset password email sent successfully',
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<ForgotPasswordResponseDto> {
    const payload = this.tokenService.verifyAccessToken(token);
    if (!payload) {
      throw new BadRequestException(ERROR_BAD_REQUEST);
    }

    const user = await this.prisma.user.findUnique({
      where: { userId: (await payload).id },
    });

    if (!user) {
      throw new BadRequestException(ERROR_USER_NOT_FOUND);
    }

    const hashedPassword = await this.passwordService.hashPassword(newPassword);
    await this.prisma.user.update({
      where: { userId: user.userId },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    return {
      email: user.email,
      message: 'Password reset successfully',
    }
  }
}
