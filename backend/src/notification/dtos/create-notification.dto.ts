import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty({ message: 'Message cannot be empty' })
  @IsString()
  message!: string;

  @IsNotEmpty({ message: 'User ID is required' })
  @IsUUID()
  userId!: string;

  @IsOptional()
  @IsString()
  metadata?: string;
}
