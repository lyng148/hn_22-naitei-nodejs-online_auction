import { ShippingResponseDto } from './shipping-response.dto';

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetSellerShippingsResponseDto {
  shippings: ShippingResponseDto[];
  pagination: PaginationMeta;
}
