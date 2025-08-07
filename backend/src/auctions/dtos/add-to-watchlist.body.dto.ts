import { IsNotEmpty } from "class-validator";

export class AddToWatchlistDto {
    @IsNotEmpty()
    auctionId!: string;
}
