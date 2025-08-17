import { forwardRef, Inject, Injectable } from '@nestjs/common';
import PrismaService from '../common/services/prisma.service';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { ListNotificationQueryDto } from './dtos/notification-query.dto';
import { NotificationResponseDto, NotificationResponseListDto } from './dtos/notification-response.dto';
import {
  ERROR_ALREADY_MARKED_AS_READ,
  ERROR_NOT_FOUND_NOTIFICATION,
  LIMIT_NOTIFICATION_DEFAULT,
  OFFSET_NOTIFICATION_DEFAULT,
  SEND_NOTIFICATION_ERROR,
  SUCCESS_NOTIFICATION_MESSAGES
} from './notification-constants';
import { NotificationGateway } from './notification-gateway';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(forwardRef(() => NotificationGateway))
    private readonly notificationGateway: NotificationGateway,
  ) { }

  async createNotification(dto: CreateNotificationDto): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.create({
      data: {
        message: dto.message,
        userId: dto.userId,
        isRead: false,
        metadata: dto.metadata ? JSON.parse(dto.metadata) : undefined,
      },
    });

    if (!notification) {
      throw new Error(SEND_NOTIFICATION_ERROR);
    }

    const notificationResponse = await this.buildNotificationResponse(notification);
    await this.sendNotificationToUser(dto.userId, notificationResponse);

    return notificationResponse;
  }

  async getUserNotifications(userId: string, query: ListNotificationQueryDto): Promise<NotificationResponseListDto> {
    const page = query.offset || OFFSET_NOTIFICATION_DEFAULT;
    const size = query.limit || LIMIT_NOTIFICATION_DEFAULT;

    const [notifications, count] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: page * size,
        take: size,
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);
    return {
      notifications: await Promise.all(notifications.map(n => this.buildNotificationResponse(n))),
      count,
    };
  }

  async getUnreadNotifications(userId: string): Promise<NotificationResponseListDto> {
    const [notifications, count] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId, isRead: false },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    if (!notifications) {
      throw new Error(ERROR_NOT_FOUND_NOTIFICATION);
    }
    return {
      notifications: await Promise.all(notifications.map(n => this.buildNotificationResponse(n))),
      count,
    };
  }

  async markAsRead(notificationId: string, userId: string): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.findUnique({
      where: { notificationId, userId },
    });
    if (!notification) {
      throw new Error(ERROR_NOT_FOUND_NOTIFICATION);
    }
    if (notification.isRead) {
      throw new Error(ERROR_ALREADY_MARKED_AS_READ);
    }

    const updatedNotification = await this.prisma.notification.update({
      where: { notificationId },
      data: { isRead: true },
    });

    return this.buildNotificationResponse(updatedNotification);
  }

  async markAllAsRead(userId: string): Promise<string> {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return SUCCESS_NOTIFICATION_MESSAGES.ALL;
  }

  private async sendNotificationToUser(userId: string, notification: NotificationResponseDto) {
    try {

      this.notificationGateway.sendToUser(userId, notification);

    } catch (error) {
      throw new Error(SEND_NOTIFICATION_ERROR);
    }
  }

  private async buildNotificationResponse(notification: any): Promise<NotificationResponseDto> {
    return {
      id: notification.notificationId,
      message: notification.message,
      userId: notification.userId,
      read: notification.isRead,
      createdAt: notification.createdAt,
      metadata: notification.metadata ? JSON.stringify(notification.metadata) : undefined,
    };
  }
}
