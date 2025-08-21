import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../common/guards/ws-jwt.guard';
import TokenService from '../common/services/token.service';
import PrismaService from '../common/services/prisma.service';
import { ERROR_INVALID_WEBSOCKET_TOKEN } from '../chat/chat-constants';
import { ERROR_USER_NOT_FOUND } from '../common/constants/error.constant';
import { NotificationService } from './notification.service';
import { NOTIFICATION_EVENTS } from './notification-constants';

@WebSocketGateway({
  namespace: '/notification',
  cors: {
    origin: [process.env.WEBSOCKET_CORS_ORIGIN || 'http://localhost:5173',
    'http://localhost:3000',
  ],
    credentials: true,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket'],
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly tokenService: TokenService,
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) { }

  async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
    try {
      const token = client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '') ||
        client.handshake.headers?.['authorization']?.replace('Bearer ', '') ||
        client.request?.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        client.emit('notification_error', {
          success: false,
          message: ERROR_INVALID_WEBSOCKET_TOKEN.message,
          timestamp: new Date().toISOString(),
        });
        client.disconnect(true);
        return;
      }

      let payload;
      try {
        payload = await this.tokenService.verifyAccessToken(token);
      } catch (jwtError) {
        client.emit('notification_error', {
          success: false,
          message: ERROR_INVALID_WEBSOCKET_TOKEN.message,
          timestamp: new Date().toISOString(),
        });
        client.disconnect(true);
        return;
      }

      const user = await this.prisma.user.findUnique({
        where: { userId: payload.id },
        select: {
          userId: true,
          email: true,
          role: true
        },
      });

      if (!user) {
        client.emit('notification_error', {
          success: false,
          message: ERROR_USER_NOT_FOUND.message,
          timestamp: new Date().toISOString(),
        });
        client.disconnect(true);
        return;
      }

      client.data.user = user;
      const userRoom = `user.${user.userId}.notifications`;
      client.join(userRoom);

      client.emit('notification_connected', {
        success: true,
        message: 'Connected to notification server',
        userId: user.userId,
        socketId: client.id,
        userRoom,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      client.emit('notification_error', {
        success: false,
        message: error instanceof Error ? error.message : 'Connection error',
        timestamp: new Date().toISOString(),
      });
      client.disconnect(true);
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket): Promise<void> {
    const userId = client.data.user?.userId;
    if (userId) {
      this.server.to(`user.${userId}.notifications`).emit('notification_disconnected', {
        success: true,
        userId,
        message: 'User disconnected from notification server',
        timestamp: new Date().toISOString(),
      });
    }
  }

  sendToUser(userId: string, notification: any) {
    const room = `user.${userId}.notifications`;
    this.server.to(room).emit(NOTIFICATION_EVENTS.NEW_NOTIFICATION, {
      ...notification,
      timestamp: new Date().toISOString(),
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(NOTIFICATION_EVENTS.MARK_AS_READ)
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { notificationId: string },
  ) {
    const user = client.data.user;
    try {
      const result = await this.notificationService.markAsRead(
        data.notificationId,
        user.userId
      );
      client.emit(NOTIFICATION_EVENTS.MARK_AS_READ, {
        success: true,
        data: result,
        message: 'Notification marked as read successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      client.emit('notification_error', {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to mark notification as read',
        timestamp: new Date().toISOString(),
      });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(NOTIFICATION_EVENTS.MARK_ALL_AS_READ)
  async handleMarkAllAsRead(
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    try {
      const result = await this.notificationService.markAllAsRead(user.userId);
      client.emit(NOTIFICATION_EVENTS.MARK_ALL_AS_READ, {
        success: true,
        message: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      client.emit('notification_error', {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to mark all notifications as read',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
