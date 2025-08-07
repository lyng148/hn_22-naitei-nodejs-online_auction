import { AuctionStatus, BidStatus } from '@prisma/client';

export class AuctionProductDetailDto {
  productId!: string;

  name!: string;

  description!: string;

  quantity!: number;

  categories!: string[];

  images!: string[];
}

export class AuctionBidDetailDto {
  bidId!: string;

  bidAmount!: string;

  status!: BidStatus;

  createdAt!: Date;

  bidderId!: string;

  bidderName!: string;
}


export class GetAuctionDetailResponseDto {
  auctionId!: string;

  title!: string;

  startTime!: Date;

  endTime!: Date;

  startingPrice!: string;

  currentPrice!: string;

  minimumBidIncrement!: string;

  sellerName!: string;

  sellerId!: string;

  status!: AuctionStatus;

  lastBidTime!: Date;

  winnerId?: string;

  winnerName?: string;

  createdAt!: Date;

  products!: AuctionProductDetailDto[];

  bids!: AuctionBidDetailDto[];
}
