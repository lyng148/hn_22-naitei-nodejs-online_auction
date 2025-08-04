import { CreateAuctionDto } from './dtos/create-auction.body.dto';
import PrismaService from '@common/services/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ERROR_AUCTION_START_TIME_IN_PAST,
  ERROR_INVALID_AUCTION_TIME,
  ERROR_PRODUCT_NOT_FOUND,
  ERROR_PRODUCT_STOCK_INSUFFICIENT,
} from './auction.constant';
import { AuctionStatus } from '@prisma/client';
import { CreateAuctionResponseDto } from './dtos/create-auction.response.dto';

@Injectable()
export class AuctionService {
  constructor(private readonly prisma: PrismaService) {}

  async createAuction(
    dto: CreateAuctionDto,
  ): Promise<CreateAuctionResponseDto> {
    const {
      title,
      startTime,
      endTime,
      startingPrice,
      minimumBidIncrement,
      products,
    } = dto;

    const now = new Date();
    if (new Date(startTime) < now) {
      const { statusCode, message, errorCode } =
        ERROR_AUCTION_START_TIME_IN_PAST(now);
      throw new BadRequestException({ statusCode, message, errorCode });
    }

    if (new Date(startTime) >= new Date(endTime)) {
      throw new BadRequestException(ERROR_INVALID_AUCTION_TIME);
    }

    const productIds = products.map((p) => p.productId);

    const result = await this.prisma.$transaction(async (tx) => {
      const foundProducts = await tx.product.findMany({
        where: { productId: { in: productIds } },
      });

      if (foundProducts.length !== productIds.length)
        throw new NotFoundException(ERROR_PRODUCT_NOT_FOUND);

      const productMap = new Map(
        foundProducts.map((product) => [product.productId, product]),
      );

      for (const { productId, quantity } of products) {
        const product = productMap.get(productId);
        if (!product) continue;

        if (product.stockQuantity < quantity) {
          const { statusCode, message, errorCode } =
            ERROR_PRODUCT_STOCK_INSUFFICIENT(productId);
          throw new BadRequestException({ statusCode, message, errorCode });
        }

        await tx.product.update({
          where: { productId },
          data: {
            stockQuantity: { decrement: quantity },
          },
        });
      }

      const auction = await tx.auction.create({
        data: {
          title,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          startingPrice,
          currentPrice: startingPrice,
          minimumBidIncrement,
          lastBidTime: new Date(startTime),
          status: AuctionStatus.PENDING,
          products: {
            connect: productIds.map((id) => ({ productId: id })),
          },
        },
        include: { products: true },
      });

      return auction;
    });

    return {
      auctionId: result.auctionId,
      title: result.title,
      startTime: result.startTime,
      endTime: result.endTime,
      startingPrice: result.startingPrice.toString(),
      minimumBidIncrement: result.minimumBidIncrement.toString(),
      status: result.status,
      products: products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
      })),
    };
  }
}
