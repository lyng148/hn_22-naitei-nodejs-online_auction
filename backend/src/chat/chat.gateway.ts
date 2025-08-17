import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../common/guards/ws-jwt.guard';
import {
  ERROR_FAILED_TO_JOIN_ROOM,
  ERROR_FAILED_TO_SEND_MESSAGE,
  ERROR_NO_ACCESS_TO_CHAT_ROOM,
  LIMIT_DEFAULT,
  OFFSET_DEFAULT,
  SUCCESS_ROOM_JOINED,
  WS_EVENTS,
} from './chat-constants';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { ListMessageQueryDto } from './dtos/list-message-query.dto';

@WebSocketGateway({
  cors: {
    origin: [
      process.env.WEBSOCKET_CORS_ORIGIN || 'http://localhost:5173',
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ["GET", "POST"],
  },
  namespace: '/chat',
  transports: ['websocket'],
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private connectedUsers = new Map<string, string>(); // userId -> socketId
  private userSockets = new Map<string, string>();    // socketId -> userId

  constructor(private readonly chatService: ChatService) {
    this.chatService.setGateway(this);
  }

  async handleConnection(client: Socket): Promise<void> {
    try {
      const user = await this.chatService.validateUser(client);
      client.data.user = user;
      this.connectedUsers.set(user.id, client.id);
      this.userSockets.set(client.id, user.id);

      const userQueue = `user.${user.id}.queue`;
      client.join(userQueue);

      client.emit(WS_EVENTS.CONNECTION_SUCCESS, {
        message: 'Connected to chat server',
        userId: user.id,
        socketId: client.id,
        userQueue,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      client.emit(WS_EVENTS.ERROR, {
        message: error,
        timestamp: new Date().toISOString()
      });
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const userId = this.userSockets.get(client.id);
    if (userId) {
      this.connectedUsers.delete(userId);
      this.userSockets.delete(client.id);
    }
  }

  async broadcastToRoomExceptSender(
    roomId: string,
    event: string,
    data: any,
    senderId: string
  ): Promise<void> {
    const senderSocketId = this.connectedUsers.get(senderId);

    if (senderSocketId) {
      this.server.to(roomId).except(senderSocketId).emit(event, {
        ...data,
        broadcastType: event,
        timestamp: new Date().toISOString()
      });
    } else {
      this.server.to(roomId).emit(event, {
        ...data,
        broadcastType: event,
        excludeSenderId: senderId,
        timestamp: new Date().toISOString()
      });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(WS_EVENTS.JOIN_ROOM)
  async handleJoinChatRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      chatRoomId?: string;  // ✅ Accept chatRoomId
      otherUserId?: string; // ✅ Accept otherUserId
      query?: ListMessageQueryDto;
    },
  ) {
    const user = client.data.user;
    const { chatRoomId, otherUserId, query } = data;

    try {
      let result;

      if (chatRoomId) {
        // Join existing room by ID
        const hasAccess = await this.chatService.validateUserRoomAccess(chatRoomId, user.id);
        if (!hasAccess) {
          throw new Error(ERROR_NO_ACCESS_TO_CHAT_ROOM.message);
        }

        // Get room details
        const roomDetails = await this.chatService.getChatRoomWithDetails(chatRoomId, user.id);

        result = {
          success: true,
          data: {
            chatRoom: { chatRoomId },
            otherUser: roomDetails.otherUser
          }
        };
      } else if (otherUserId) {
        // Create/get room by otherUserId
        result = await this.chatService.handleCreateOrGetChatRoom(
          { otherUserId },
          user.id
        );
      } else {
        throw new Error(ERROR_FAILED_TO_JOIN_ROOM.message);
      }

      const finalChatRoomId = chatRoomId || result.data.chatRoom.chatRoomId;
      const roomTopic = `room.${finalChatRoomId}`;
      const userQueue = `user.${user.id}.queue`;

      // Leave all previous rooms first
      const currentRooms = Array.from(client.rooms);
      currentRooms.forEach(room => {
        if (room.startsWith('room.') && room !== roomTopic) {
          client.leave(room);
        }
      });

      // Join new room
      client.join(roomTopic);
      client.join(userQueue);

      const messagesResult = await this.chatService.handleGetMessages(
        finalChatRoomId,
        query || { limit: 20, offset: 0 },
        user.id
      );

      client.emit(WS_EVENTS.ROOM_JOINED, {
        chatRoomId: finalChatRoomId,
        messages: messagesResult.data,
        otherUser: result.data.otherUser,
        pagination: messagesResult.pagination,
        chatType: '1-on-1',
        participantCount: 2,
        success: true,
        message: SUCCESS_ROOM_JOINED.message,
        subscriptions: {
          roomTopic,
          userQueue
        }
      });

      // Mark messages as read when joining
      await this.chatService.handleMarkMessagesAsRead(finalChatRoomId, user.id);

      // Broadcast read status to room
      this.server.to(roomTopic).emit(WS_EVENTS.MESSAGES_READ, {
        chatRoomId: finalChatRoomId,
        readBy: user.id,
        success: true,
        message: 'Messages marked as read on join',
        timestamp: new Date().toISOString()
      });

      // Notify room that user joined
      this.server.to(roomTopic).emit(WS_EVENTS.USER_JOINED, {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_FAILED_TO_JOIN_ROOM.message;
      client.emit(WS_EVENTS.ERROR, {
        code: ERROR_FAILED_TO_JOIN_ROOM.code,
        message: errorMessage,
      });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(WS_EVENTS.GET_MORE_MESSAGES)
  async handleGetMoreMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      chatRoomId: string;
      query: ListMessageQueryDto;
    },
  ) {
    const user = client.data.user;
    const { chatRoomId, query } = data;

    try {
      const messageQuery = await this.validateMessageQuery(query);

      const messagesResult = await this.chatService.handleGetMessages(
        chatRoomId,
        messageQuery,
        user.id
      );

      client.emit(WS_EVENTS.MORE_MESSAGES, {
        chatRoomId,
        messages: messagesResult.data,
        pagination: {
          limit: messageQuery.limit,
          offset: messageQuery.offset,
          total: messagesResult.pagination?.total || messagesResult.data.length,
          hasMore: messagesResult.data.length === messageQuery.limit,
        },
        success: true,
        message: 'More messages retrieved successfully',
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get more messages';
      client.emit(WS_EVENTS.ERROR, {
        code: 'FAILED_TO_GET_MORE_MESSAGES',
        message: errorMessage,
      });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(WS_EVENTS.SEND_MESSAGE)
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateMessageDto & { chatRoomId: string },
  ) {
    const user = client.data.user;
    const { chatRoomId, ...messageDto } = data;

    try {
      const result = await this.chatService.handleSendMessage(
        chatRoomId,
        messageDto,
        user.id
      );

      if (result.success) {
        client.emit(WS_EVENTS.MESSAGE_SENT, {
          success: true,
          data: result.data,
          message: result.message,
          timestamp: new Date().toISOString()
        });

        const roomTopic = `room.${chatRoomId}`;
        this.server.to(roomTopic).emit(WS_EVENTS.ROOM_MESSAGE, {
          ...result.data,
          messageType: 'room_broadcast',
          timestamp: new Date().toISOString(),
          roomId: chatRoomId,
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_FAILED_TO_SEND_MESSAGE.message;
      client.emit(WS_EVENTS.ERROR, {
        code: ERROR_FAILED_TO_SEND_MESSAGE.code,
        message: errorMessage,
      });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(WS_EVENTS.MARK_READ)
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatRoomId: string },
  ) {
    const user = client.data.user;

    try {
      const result = await this.chatService.handleMarkMessagesAsRead(
        data.chatRoomId,
        user.id
      );

      client.emit(WS_EVENTS.MESSAGES_READ, {
        chatRoomId: data.chatRoomId,
        success: true,
        message: result.message,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark messages as read';
      client.emit(WS_EVENTS.ERROR, {
        code: 'FAILED_TO_MARK_READ',
        message: errorMessage,
      });
    }
  }

  public isRoomActive(chatRoomId: string): boolean {
    const roomId = `room_${chatRoomId}`;
    const room = this.server.sockets.adapter.rooms.get(roomId);
    return room ? room.size > 0 : false;
  }

  private async validateMessageQuery(query?: Partial<ListMessageQueryDto>): Promise<ListMessageQueryDto> {
    const messageQuery = plainToClass(ListMessageQueryDto, {
      limit: query?.limit || LIMIT_DEFAULT,
      offset: query?.offset || OFFSET_DEFAULT,
    });

    const errors = await validate(messageQuery);
    if (errors.length > 0) {
      const errorMessage = errors.map(error =>
        Object.values(error.constraints || {}).join(', ')
      ).join('; ');
      throw new Error(`Invalid query parameters: ${errorMessage}`);
    }

    return messageQuery;
  }

  getUserSocketId(userId: string): string | undefined {
    return this.connectedUsers.get(userId);
  }
  async getClientCountInRoom(userId: string): Promise<number> {
    const room = `user.${userId}.notifications`;
    const sockets = await this.server.in(room).fetchSockets();
    return sockets.length;
  }
}
