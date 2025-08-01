import { ProductStatus } from '@prisma/client';

export class ProductImageResponseDto {
  imageUrl!: string;
  isPrimary!: boolean;
}

export class CreateProductResponseDto {
  productId!: string;
  name!: string;
  description?: string;
  stockQuantity!: number;
  status!: ProductStatus;
  images!: ProductImageResponseDto[];
}

export class CreateMultipleProductsResponseDto {
  products!: CreateProductResponseDto[];
  count!: number;
  message!: string;
}