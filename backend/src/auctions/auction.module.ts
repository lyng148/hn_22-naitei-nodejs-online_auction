import { Module } from '@nestjs/common';
import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';
import { CommonModule } from '@common/common.module';
import { BidModule } from '../bid/bid.module';
import { AuctionGateway } from './auction.gateway';

@Module({
  imports: [CommonModule, BidModule],
  controllers: [AuctionController],
  providers: [AuctionService, AuctionGateway],
  exports: [AuctionService],
})
export class AuctionModule {}
