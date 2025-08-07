// chat.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // ← Add this import
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import TokenService from '../common/services/token.service';
import PrismaService from '../common/services/prisma.service';

@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatGateway,
    TokenService,
    PrismaService,
  ],
  imports: [
    JwtModule.register({}), 
  ],
})
export class ChatModule {}
