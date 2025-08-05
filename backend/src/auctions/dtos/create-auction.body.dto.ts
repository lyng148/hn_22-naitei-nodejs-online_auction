import {
  IsNotEmpty,
  IsDateString,
  IsNumberString,
  IsArray,
  ValidateNested,
  IsUUID,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class AuctionProductItemDto {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateAuctionDto {
  @IsNotEmpty()
  title!: string;

  @IsDateString()
  startTime!: string;

  @IsDateString()
  endTime!: string;

  @IsNumberString()
  startingPrice!: string;

  @IsNumberString()
  minimumBidIncrement!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AuctionProductItemDto)
  products!: AuctionProductItemDto[];
}
