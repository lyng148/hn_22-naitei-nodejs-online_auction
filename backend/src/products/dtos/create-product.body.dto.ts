import { IsString, IsNotEmpty, IsOptional, IsArray, IsUrl, MaxLength, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  stockQuantity!: number;

  @IsArray()
  @IsOptional()
  @IsUrl({}, { each: true })
  @Type(() => String)
  imageUrls!: string[];

  // Cap nhat category trong cac pull request sau nay
}


export class CreateMultipleProductsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductDto)
  products!: CreateProductDto[];
}