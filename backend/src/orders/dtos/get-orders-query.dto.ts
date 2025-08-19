import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@common/enums/order-status.enum';
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MIN_PAGE,
  MAX_LIMIT,
  MIN_LIMIT,
  DEFAULT_SORT_ORDER,
  DEFAULT_SORT_BY,
} from '../order.constants';

export enum OrderSortField {
  TOTAL_AMOUNT = 'totalAmount',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetOrdersQueryDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(MIN_PAGE)
  page?: number = DEFAULT_PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(MIN_LIMIT)
  @Max(MAX_LIMIT)
  limit?: number = DEFAULT_LIMIT;

  @IsOptional()
  @IsEnum(OrderSortField)
  sortBy?: OrderSortField = DEFAULT_SORT_BY as OrderSortField;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = DEFAULT_SORT_ORDER as SortOrder;
}
