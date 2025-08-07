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
import { AuctionStatus, Prisma } from '@prisma/client';
import { CreateAuctionResponseDto } from './dtos/create-auction.response.dto';
import { SearchAuctionQueryDto } from './dtos/search-auction.query.dto';
import {
  AuctionItemDto,
  SearchAuctionResponseDto,
} from './dtos/search-auction.response.dto';
import { AddToWatchlistDto } from './dtos/add-to-watchlist.body.dto';
import { ERROR_AUTION_ALREADY_IN_WATCHLIST, ERROR_AUTION_CANT_BE_ADDED_TO_WATCHLIST, ERROR_AUTION_NOT_FOUND } from '@common/constants/error.constant';
import { AddToWatchlistResponseDto } from './dtos/add-to-watchlist.response.dto';
import { RemoveFromWatchlistDto, RemoveFromWatchlistResponseDto } from './dtos/remove-from-watchlist.dto';

@Injectable()
export class AuctionService {
  constructor(private readonly prisma: PrismaService) { }

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
        },
      });

      await tx.auctionProduct.createMany({
        data: products.map(({ productId, quantity }) => ({
          auctionId: auction.auctionId,
          productId,
          quantity,
        })),
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

  async searchAuctions(
    query: SearchAuctionQueryDto,
  ): Promise<SearchAuctionResponseDto> {
    const where: Prisma.AuctionWhereInput = {
      ...(query.sellerId && {
        auctionProducts: { some: { product: { sellerId: query.sellerId } } },
      }),
      ...(query.title && {
        title: { contains: query.title },
      }),
      ...(query.categoryType && {
        auctionProducts: {
          some: {
            product: {
              productCategories: {
                some: {
                  category: { name: { in: query.categoryType } },
                },
              },
            },
          },
        },
      }),
      ...(query.status && { status: query.status }),
      ...(query.minPrice && { currentPrice: { gte: query.minPrice } }),
      ...(query.maxPrice && { currentPrice: { lte: query.maxPrice } }),
      ...(query.startTime && { startTime: { gte: new Date(query.startTime) } }),
      ...(query.endTime && { endTime: { lte: new Date(query.endTime) } }),
    };

    const [total, rawAuctions] = await this.prisma.$transaction([
      this.prisma.auction.count({ where }),
      this.prisma.auction.findMany({
        where,
        skip: query.page * query.size,
        take: query.size,
        orderBy: { [query.sortField]: query.sortDirection },
        select: {
          auctionId: true,
          title: true,
          startTime: true,
          endTime: true,
          startingPrice: true,
          currentPrice: true,
          minimumBidIncrement: true,
          status: true,
        },
      }),
    ]);

    const auctions: AuctionItemDto[] = rawAuctions.map((auction) => ({
      auctionId: auction.auctionId,
      title: auction.title,
      startTime: auction.startTime,
      endTime: auction.endTime,
      startingPrice: auction.startingPrice.toString(),
      currentPrice: auction.currentPrice.toString(),
      minimumBidIncrement: auction.minimumBidIncrement.toString(),
      status: auction.status,
    }));

    return { total, page: query.page, size: query.size, data: auctions };
  }

  async addToWatchlist(currUser: any, addToWatchlistDto: AddToWatchlistDto): Promise<AddToWatchlistResponseDto> {
    const auctionId = addToWatchlistDto.auctionId;
    const auction = await this.prisma.auction.findUnique({
      where: { auctionId },
    });
    if (!auction) {
      throw new NotFoundException(ERROR_AUTION_NOT_FOUND);
    }

    if (auction.status !== AuctionStatus.OPEN && auction.status !== AuctionStatus.READY) {
      throw new BadRequestException(ERROR_AUTION_CANT_BE_ADDED_TO_WATCHLIST);
    }

    const userId = currUser.id;
    const existingWatchlist = await this.prisma.watchlist.findFirst({
      where: {
        userId,
        auctionId,
      },
    });

    if (existingWatchlist) {
      throw new BadRequestException(ERROR_AUTION_ALREADY_IN_WATCHLIST);
    }

    const watchlistItem = await this.prisma.watchlist.create({
      data: {
        userId,
        auctionId,
      },
      select: {
        watchlistId: true,
        auction: {
          select: {
            auctionId: true,
            title: true,
            startTime: true,
            endTime: true,
            startingPrice: true,
            minimumBidIncrement: true,
            status: true,
            auctionProducts: {
              select: {
                product: {
                  select: {
                    productId: true,
                    name: true,
                    stockQuantity: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      auctionId: watchlistItem.auction.auctionId,
      title: watchlistItem.auction.title,
      startTime: watchlistItem.auction.startTime,
      endTime: watchlistItem.auction.endTime,
      startingPrice: watchlistItem.auction.startingPrice,
      minimumBidIncrement: watchlistItem.auction.minimumBidIncrement,
      status: watchlistItem.auction.status,
      products: watchlistItem.auction.auctionProducts.map(ap => ap.product),
    };
  }

  async removeFromWatchlist(currUser: any, removeFromWatchlistDto: RemoveFromWatchlistDto): Promise<RemoveFromWatchlistResponseDto> {
    const auctionId = removeFromWatchlistDto.auctionId;
    const result = await this.prisma.watchlist.deleteMany({
      where: {
        userId: currUser.id,
        auctionId,
      },
    });
    if (result.count === 0) {
      throw new NotFoundException(ERROR_AUTION_NOT_FOUND);
    }
    return { message: 'Auction removed from watchlist successfully' };
  }
}
