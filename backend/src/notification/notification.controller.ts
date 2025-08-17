import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Auth } from '../common/decorators/auth.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';
import { AuthType } from '../common/types/auth-type.enum';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { ListNotificationQueryDto } from './dtos/notification-query.dto';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Post('create')
  async create(@Body() dto: CreateNotificationDto) {
    return this.notificationService.createNotification(dto);
  }

  @Get()
  @Auth(AuthType.ACCESS_TOKEN)
  async getUserNotifications(
    @CurrentUser() user: { id: string },
    @Query() query: ListNotificationQueryDto
  ) {
    return this.notificationService.getUserNotifications(user.id, query);
  }

  @Get('unread')
  @Auth(AuthType.ACCESS_TOKEN)
  async getUnreadNotifications(@CurrentUser() user: { id: string }) {
    return this.notificationService.getUnreadNotifications(user.id);
  }

  @Put(':notificationId/read')
  @Auth(AuthType.ACCESS_TOKEN)
  async markAsRead(@Param('notificationId') notificationId: string, @CurrentUser() user: { id: string }) {
    return this.notificationService.markAsRead(notificationId, user.id);
  }

  @Put('read-all')
  async markAllAsRead(@CurrentUser() user: { id: string }) {
    return this.notificationService.markAllAsRead(user.id);
  }
}
