import { Module } from '@nestjs/common';
import { AuctionCommentsController } from './auction-comments.controller';
import { AuctionCommentsService } from './auction-comments.service';
import { CommonModule } from '@common/common.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [CommonModule, NotificationModule],
  controllers: [AuctionCommentsController],
  providers: [AuctionCommentsService],
  exports: [AuctionCommentsService],
})
export class AuctionCommentsModule {}
