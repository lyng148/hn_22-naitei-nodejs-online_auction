import { ShippingResponseDto } from './shipping-response.dto';

export interface PaginationDto {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetBidderShippingsResponseDto {
  shippings: ShippingResponseDto[];
  pagination: PaginationDto;
}
