import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UploadImageDto {
  @IsOptional()
  @IsString()
  fileName?: string;
}

export class UploadImageResponseDto {
  imageUrl!: string;
}