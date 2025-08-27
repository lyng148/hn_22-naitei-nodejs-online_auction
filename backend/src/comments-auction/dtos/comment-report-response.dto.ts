import { ReportStatus, ReportType } from '@prisma/client';

export class CommentReportResponseDto {
  reportId!: string;
  commentId!: string;
  type!: ReportType;
  reason!: string;
  status!: ReportStatus;
  createdAt!: Date;
  updatedAt!: Date;
  reviewedAt?: Date;
  adminNote?: string;

  comment?: {
    content: string;
    createdAt: Date;
    auction: {
      auctionId: string;
      title: string;
    };
    user: {
      userId: string;
      email: string;
      profile?: {
        fullName?: string;
        profileImageUrl?: string;
      };
    };
  };

  reporter?: {
    userId: string;
    email: string;
    profile?: {
      fullName?: string;
    };
  };

  reviewer?: {
    userId: string;
    email: string;
    profile?: {
      fullName?: string;
    };
  };
}

export class GetCommentReportsResponseDto {
  data!: CommentReportResponseDto[];
  total!: number;
  page!: number;
  limit!: number;
  message!: string;
}

export class ReportStatsResponseDto {
  totalReports!: number;
  pendingReports!: number;
  resolvedReports!: number;
  dismissedReports!: number;
  autoHiddenComments!: number;
  message!: string;
}
