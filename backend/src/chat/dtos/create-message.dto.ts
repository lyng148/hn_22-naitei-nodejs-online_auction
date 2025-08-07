import { IsString, IsNotEmpty, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { MessageType } from '@prisma/client';
import { CHAT_VALIDATION, MESSAGE_TYPES } from '../chat-constants';

export class CreateMessageDto {
  @IsString()
  @IsOptional()
  @MaxLength(CHAT_VALIDATION.MESSAGE.MAX_LENGTH, {
    message: CHAT_VALIDATION.MESSAGE.MESSAGE,
  })
  content?: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsEnum(MESSAGE_TYPES)
  @IsOptional()
  type?: MessageType;
}
