import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrdersService } from '../orders.service';
import { DOMAIN_EVENTS } from '../../notification/notification-constants';

@Injectable()
export class OrderAuctionListener {
  private readonly logger = new Logger(OrderAuctionListener.name);

  constructor(private readonly ordersService: OrdersService) {}

  @OnEvent(DOMAIN_EVENTS.AUCTION_ENDED)
  async onAuctionEnded(payload: { 
    auctionId: string; 
    winnerId?: string; 
    finalPrice: number 
  }) {
    try {
      // Only create order if there's a winner
      if (!payload.winnerId) {
        this.logger.log(`Auction ${payload.auctionId} ended without winner, no order created`);
        return;
      }

      // Create order for the auction winner
      const result = await this.ordersService.createOrderFromAuction(
        payload.auctionId,
        payload.winnerId,
        payload.finalPrice,
      );

      this.logger.log(
        `Order ${result.orderId} created for auction ${payload.auctionId} winner ${payload.winnerId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create order for auction ${payload.auctionId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
