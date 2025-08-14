import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAuctionDto {
  @IsNotEmpty()
  title!: string;

  @IsDateString()
  endTime!: string;

  @ValidateNested({ each: true })
  @Type(() => UpdateAuctionProductDto)
  products!: UpdateAuctionProductDto[];
}

export class UpdateAuctionProductDto {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}
