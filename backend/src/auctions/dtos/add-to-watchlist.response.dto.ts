import { Decimal } from "@prisma/client/runtime/library";

export class AddToWatchlistResponseDto {
  auctionId!: string;
  title!: string;
  startTime!: Date;
  endTime!: Date;
  startingPrice!: Decimal;
  minimumBidIncrement!: Decimal;
  status!: string;
  products!: {
    productId: string;
    name: string;
    stockQuantity: number;
    status: string;
  }[];
}
