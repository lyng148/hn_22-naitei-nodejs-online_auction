import {
  IsOptional,
  IsEnum,
  IsString,
  IsInt,
  Min,
  Max,
  Length,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ShippingStatus } from '@common/enums/shipping-status.enum';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
  MIN_LIMIT,
  MIN_PAGE,
  VALIDATION_RULES,
} from '../shipping.constants';

export enum ShippingSortField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  SHIPPED_AT = 'shippedAt',
  ESTIMATED_DELIVERY = 'estimatedDelivery',
  ACTUAL_DELIVERY = 'actualDelivery',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetSellerShippingsQueryDto {
  @IsOptional()
  @IsEnum(ShippingStatus)
  status?: ShippingStatus;

  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  @Length(
    VALIDATION_RULES.SEARCH_MIN_LENGTH,
    VALIDATION_RULES.SEARCH_MAX_LENGTH,
  )
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(MIN_PAGE)
  page?: number = DEFAULT_PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(MIN_LIMIT)
  @Max(MAX_LIMIT)
  limit?: number = DEFAULT_LIMIT;

  @IsOptional()
  @IsEnum(ShippingSortField)
  sortBy?: ShippingSortField = ShippingSortField.CREATED_AT;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}
