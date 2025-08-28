import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderAuctionListener } from './listeners/order-auction-listener';
import { CommonModule } from '@common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrderAuctionListener],
  exports: [OrdersService],
})
export class OrdersModule {}
