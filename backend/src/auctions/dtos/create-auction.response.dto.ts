export class CreateAuctionResponseDto {
  auctionId!: string;

  title!: string;

  startTime!: Date;

  endTime!: Date;

  startingPrice!: string;

  minimumBidIncrement!: string;

  status!: string;

  products!: {
    productId: string;
    quantity: number;
  }[];
}
