import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import PrismaService from '../common/services/prisma.service';
import TokenService from '../common/services/token.service';
import { NotificationGateway } from './notification-gateway';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    JwtModule.register({}),
  ],
  controllers: [NotificationController],
  providers: [
    PrismaService,
    TokenService,
    NotificationService,
    NotificationGateway,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
