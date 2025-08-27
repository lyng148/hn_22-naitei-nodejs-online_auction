import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import PrismaService from '@common/services/prisma.service';
import { AuctionStatus } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DOMAIN_EVENTS } from '../notification/notification-constants';
import { AuctionService } from './auction.service';

@Injectable()
export class AuctionScheduler {
  private readonly logger = new Logger(AuctionScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly auctionService: AuctionService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async updateReadyAuctionsToOpen(): Promise<void> {
    const now = new Date();

    const readyAuctions = await this.prisma.auction.findMany({
      where: {
        status: AuctionStatus.READY,
        startTime: { lte: now },
      },
    });

    if (readyAuctions.length > 0) {
      await Promise.all(
        readyAuctions.map(async (auction) => {
          await this.prisma.auction.update({
            where: { auctionId: auction.auctionId },
            data: { status: AuctionStatus.OPEN },
          });

          this.eventEmitter.emit(DOMAIN_EVENTS.AUCTION_STATUS_CHANGED, {
            auctionId: auction.auctionId,
            status: 'OPEN',
            previousStatus: 'READY',
          });
        }),
      );

      this.logger.log(
        `Opened ${readyAuctions.length} auctions that reached start time`,
      );
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredPendingAuctions(): Promise<void> {
    const now = new Date();

    const pendingAuctions = await this.prisma.auction.findMany({
      where: {
        status: AuctionStatus.PENDING,
        endTime: { lte: now },
      },
    });

    if (pendingAuctions.length > 0) {
      await Promise.all(
        pendingAuctions.map(async (auction) => {
          await this.prisma.auction.update({
            where: { auctionId: auction.auctionId },
            data: { status: AuctionStatus.CLOSED },
          });

          this.eventEmitter.emit(DOMAIN_EVENTS.AUCTION_STATUS_CHANGED, {
            auctionId: auction.auctionId,
            status: 'CLOSED',
          });
        }),
      );

      this.logger.log(
        `Closed ${pendingAuctions.length} auctions that passed end time`,
      );
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredOpenAuctions(): Promise<void> {
    const now = new Date();

    const expiredAuctions = await this.prisma.auction.findMany({
      where: {
        status: {
          in: [AuctionStatus.OPEN, AuctionStatus.EXTENDED],
        },
        endTime: { lte: now },
      },
    });

    if (expiredAuctions.length > 0) {
      await Promise.all(
        expiredAuctions.map(async (auction) => {
          try {
            await this.auctionService.endAuction(auction.auctionId);
            this.logger.log(`Ended auction ${auction.auctionId}`);
          } catch (error) {
            this.logger.error(
              `Failed to end auction ${auction.auctionId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
          }
        }),
      );

      this.logger.log(`Processed ${expiredAuctions.length} expired auctions`);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async refundProductsForClosedAuctions(): Promise<void> {
    const now = new Date();

    const closedAuctions = await this.prisma.auction.findMany({
      where: {
        status: AuctionStatus.CLOSED,
        endTime: { lt: now },
      },
      include: { auctionProducts: true },
    });

    if (closedAuctions.length === 0) return;

    await this.prisma.$transaction(async (tx) => {
      for (const auction of closedAuctions) {
        for (const ap of auction.auctionProducts) {
          await tx.product.update({
            where: { productId: ap.productId },
            data: {
              stockQuantity: { increment: ap.quantity },
            },
          });
        }

        await tx.auction.update({
          where: { auctionId: auction.auctionId },
          data: { status: 'REFUND', updatedAt: new Date() },
        });

        this.logger.log(`Refunded products for auction ${auction.auctionId}`);
      }
    });
  }
}
