import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

export class ListNotificationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(0)
  offset?: number;
}
