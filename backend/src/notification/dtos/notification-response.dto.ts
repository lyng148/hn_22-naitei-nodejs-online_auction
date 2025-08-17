export class NotificationResponseDto {
  id!: string;
  message!: string;
  userId!: string;
  read!: boolean;
  createdAt!: Date;
  metadata?: string;
}

export class NotificationResponseListDto {
  notifications!: NotificationResponseDto[];
  count!: number;
}
