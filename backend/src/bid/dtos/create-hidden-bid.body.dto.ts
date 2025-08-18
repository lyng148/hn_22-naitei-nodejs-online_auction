import {
  IsArray,
  IsNotEmpty,
  IsString,
  ArrayMaxSize,
  ArrayMinSize,
  IsNumber,
  Min,
} from 'class-validator';

export class HiddenBidRequestDto {
  @IsString()
  @IsNotEmpty()
  auctionId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  bidAmounts!: number[];
}
