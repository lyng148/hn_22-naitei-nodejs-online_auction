import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { MAX_STAR_RATE, MIN_STAR_RATE } from '../comments.constant';

export class CreateCommentDto {
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsInt()
  @Min(MIN_STAR_RATE)
  @Max(MAX_STAR_RATE)
  rating?: number;
}
