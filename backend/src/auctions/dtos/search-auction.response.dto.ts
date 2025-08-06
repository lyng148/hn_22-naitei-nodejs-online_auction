import { AuctionStatus } from '@prisma/client';

export class AuctionItemDto {
  auctionId!: string;
  title!: string;
  startTime!: Date;
  endTime!: Date;
  startingPrice!: string;
  currentPrice!: string;
  minimumBidIncrement!: string;
  status!: AuctionStatus;
}

export class SearchAuctionResponseDto {
  total!: number;
  page!: number;
  size!: number;
  data!: AuctionItemDto[];
}
