import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ReportType, ReportStatus } from '@prisma/client';

export class CreateCommentReportDto {
  @IsUUID()
  @IsNotEmpty()
  commentId!: string;

  @IsEnum(ReportType)
  @IsNotEmpty()
  type!: ReportType;

  @IsString()
  @IsNotEmpty()
  reason!: string;
}

export class UpdateReportStatusDto {
  @IsEnum(ReportStatus)
  @IsNotEmpty()
  status!: ReportStatus;

  @IsString()
  @IsOptional()
  adminNote?: string;
}

export class GetReportsQueryDto {
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
