import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import PrismaService from '../common/services/prisma.service';
import TokenService from '../common/services/token.service';
import { NotificationAuctionsListener } from './listeners/notification-auctions-listener';
import { NotificationGateway } from './notification-gateway';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationUserListener } from './listeners/notificatioin-user-listener';

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
    NotificationAuctionsListener,
    NotificationUserListener,
  ],
  exports: [NotificationService],
})
export class NotificationModule { }
