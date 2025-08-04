import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import PrismaService from '../common/services/prisma.service';
import {
  ERROR_USER_NOT_FOUND,
  ERROR_USER_ALREADY_BANNED,
  ERROR_WARNING_NOT_FOUND,
} from '@common/constants/error.constant';
import { CreateWarningDto } from './dtos/create.warning.dto';
import { UserWarningStatusDto } from './dtos/warning.response.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { userId },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createWarning(
    userId: string,
    createWarningDto: CreateWarningDto,
    adminId: string,
  ): Promise<UserWarningStatusDto> {
    const user = await this.prisma.user.findUnique({
      where: { userId: userId },
    });

    if (!user) {
      throw new NotFoundException(ERROR_USER_NOT_FOUND);
    }

    if (user.isBanned) {
      throw new ForbiddenException(ERROR_USER_ALREADY_BANNED);
    }

    const result = await this.prisma.$transaction(async (prisma) => {
      const warning = await prisma.warning.create({
        data: {
          userId: userId,
          adminId: adminId,
          reason: createWarningDto.reason,
          description: createWarningDto.description,
        },
      });

      // Đếm số warnings của user
      const warningCount = await prisma.warning.count({
        where: { userId: userId },
      });

      // Nếu đủ 3 warnings thì ban user
      const shouldBan = warningCount >= 3;

      const updatedUser = await prisma.user.update({
        where: { userId: userId },
        data: {
          warningCount: warningCount,
          isBanned: shouldBan,
        },
      });

      const userWarnings = await prisma.warning.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'asc' },
      });

      return {
        user: updatedUser,
        warnings: userWarnings,
        newWarning: warning,
      };
    });

    return {
      userId: result.user.userId,
      warningCount: result.user.warningCount,
      isBanned: result.user.isBanned,
      warnings: result.warnings.map((w) => ({
        warningId: w.warningId,
        userId: w.userId,
        adminId: w.adminId,
        reason: w.reason,
        description: w.description,
        createdAt: w.createdAt,
      })),
      message: result.user.isBanned
        ? 'User has been banned due to 3 warnings'
        : `Warning created. User has ${result.user.warningCount}/3 warnings`,
    };
  }

  async getUserWarnings(userId: string): Promise<UserWarningStatusDto> {
    const user = await this.prisma.user.findUnique({
      where: { userId },
      include: {
        warnings: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(ERROR_USER_NOT_FOUND);
    }

    return {
      userId: user.userId,
      warningCount: user.warningCount,
      isBanned: user.isBanned,
      warnings: user.warnings.map((w) => ({
        warningId: w.warningId,
        userId: w.userId,
        adminId: w.adminId,
        reason: w.reason,
        description: w.description,
        createdAt: w.createdAt,
      })),
      message: `User has ${user.warningCount} warnings`,
    };
  }

  async removeWarning(warningId: string): Promise<UserWarningStatusDto> {
    const warning = await this.prisma.warning.findUnique({
      where: { warningId },
    });

    if (!warning) {
      throw new NotFoundException(ERROR_WARNING_NOT_FOUND);
    }

    const result = await this.prisma.$transaction(async (prisma) => {
      await prisma.warning.delete({
        where: { warningId },
      });

      // Cập nhật warning count và unban
      const newWarningCount = await prisma.warning.count({
        where: { userId: warning.userId },
      });

      const updatedUser = await prisma.user.update({
        where: { userId: warning.userId },
        data: {
          warningCount: newWarningCount,
          isBanned: newWarningCount >= 3,
        },
      });

      // Lấy warnings còn lại của user
      const remainingWarnings = await prisma.warning.findMany({
        where: { userId: warning.userId },
        orderBy: { createdAt: 'asc' },
      });

      return {
        user: updatedUser,
        warnings: remainingWarnings,
      };
    });

    return {
      userId: result.user.userId,
      warningCount: result.user.warningCount,
      isBanned: result.user.isBanned,
      warnings: result.warnings.map((w) => ({
        warningId: w.warningId,
        userId: w.userId,
        adminId: w.adminId,
        reason: w.reason,
        description: w.description ?? undefined,
        createdAt: w.createdAt,
      })),
      message: result.user.isBanned
        ? `Warning removed. User still banned (${result.user.warningCount}/3 warnings)`
        : `Warning removed successfully. User unbanned (${result.user.warningCount}/3 warnings)`,
    };
  }
}
