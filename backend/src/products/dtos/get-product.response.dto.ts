import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductImageDto {
  @IsString()
  imageId!: string;

  @IsString()
  imageUrl!: string;

  @IsBoolean()
  isPrimary!: boolean;
}

export class ProductCategoryDto {
  @IsString()
  categoryId!: string;

  @IsString()
  name!: string;
}

export class ProductSellerDto {
  @IsString()
  userId!: string;

  @IsString()
  fullName: string | undefined;
}

export class GetProductResponseDto {
  @IsString()
  productId!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  status!: string;

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;

  @IsNotEmpty()
  stockQuantity!: number;

  @IsOptional()
  @IsNumber()
  averageRating?: number;

  @IsOptional()
  @IsNumber()
  totalComments?: number;

  images!: ProductImageDto[];

  seller!: ProductSellerDto;

  categories!: ProductCategoryDto[];
}
