import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateChatRoomDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  otherUserId!: string;
}
