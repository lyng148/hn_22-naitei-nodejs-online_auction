import { IsNotEmpty, IsString } from "class-validator";

export class RemoveFromWatchlistDto {
  @IsNotEmpty()
  @IsString()
  auctionId!: string;
}

export class RemoveFromWatchlistResponseDto {
  message!: string;
}
