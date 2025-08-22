import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateBidBodyDto {
  @IsString()
  @IsNotEmpty()
  auctionId!: string;

  @IsNumber()
  @Min(0.01, { message: 'Bid amount must be greater than 0' })
  bidAmount!: number;
}
