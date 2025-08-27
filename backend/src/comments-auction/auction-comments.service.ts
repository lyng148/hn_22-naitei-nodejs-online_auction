import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import PrismaService from '@common/services/prisma.service';
import { CreateAuctionCommentDto } from './dtos/create-auction-comment.dto';
import { UpdateAuctionCommentDto } from './dtos/update-auction-comment.dto';
import {
  AuctionCommentResponseDto,
  GetAuctionCommentsResponseDto,
} from './dtos/auction-comment-response.dto';
import {
  CreateCommentReportDto,
  UpdateReportStatusDto,
  GetReportsQueryDto,
} from './dtos/comment-report.dto';
import {
  CommentReportResponseDto,
  GetCommentReportsResponseDto,
  ReportStatsResponseDto,
} from './dtos/comment-report-response.dto';
import { User, Role, ReportStatus } from '@prisma/client';
import {
  AUCTION_COMMENT_ERRORS,
  AUCTION_COMMENT_MESSAGES,
  REPORT_ERRORS,
  REPORT_MESSAGES,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  AUTO_HIDE_THRESHOLD,
} from './auction-comments.constant';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class AuctionCommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async createComment(
    user: User,
    createCommentDto: CreateAuctionCommentDto,
  ): Promise<AuctionCommentResponseDto> {
    const auction = await this.prisma.auction.findUnique({
      where: { auctionId: createCommentDto.auctionId },
    });

    if (!auction) {
      throw new NotFoundException(AUCTION_COMMENT_ERRORS.AUCTION_NOT_FOUND);
    }

    const comment = await this.prisma.auctionComment.create({
      data: {
        auctionId: createCommentDto.auctionId,
        userId: (user as any).id,
        content: createCommentDto.content,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    return this.formatCommentResponse(comment);
  }

  async getCommentsByAuctionId(
    auctionId: string,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_LIMIT,
  ): Promise<GetAuctionCommentsResponseDto> {
    const auction = await this.prisma.auction.findUnique({
      where: { auctionId },
    });

    if (!auction) {
      throw new NotFoundException(AUCTION_COMMENT_ERRORS.AUCTION_NOT_FOUND);
    }

    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.prisma.auctionComment.findMany({
        where: {
          auctionId,
          isHidden: false,
        },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.auctionComment.count({
        where: {
          auctionId,
          isHidden: false,
        },
      }),
    ]);

    const data = comments.map((comment) => this.formatCommentResponse(comment));

    return {
      data,
      total,
      page,
      limit,
      message: AUCTION_COMMENT_MESSAGES.COMMENTS_RETRIEVED,
    };
  }

  async getCommentById(commentId: string): Promise<AuctionCommentResponseDto> {
    const comment = await this.prisma.auctionComment.findUnique({
      where: { commentId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException(AUCTION_COMMENT_ERRORS.COMMENT_NOT_FOUND);
    }

    return this.formatCommentResponse(comment);
  }

  async updateComment(
    user: User,
    commentId: string,
    updateCommentDto: UpdateAuctionCommentDto,
  ): Promise<AuctionCommentResponseDto> {
    const existingComment = await this.prisma.auctionComment.findUnique({
      where: { commentId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!existingComment) {
      throw new NotFoundException(AUCTION_COMMENT_ERRORS.COMMENT_NOT_FOUND);
    }

    if (existingComment.userId !== (user as any).id && user.role !== Role.ADMIN) {
      throw new ForbiddenException(AUCTION_COMMENT_ERRORS.UNAUTHORIZED_ACCESS);
    }

    const updatedComment = await this.prisma.auctionComment.update({
      where: { commentId },
      data: {
        content: updateCommentDto.content ?? existingComment.content,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    return this.formatCommentResponse(updatedComment);
  }

  async deleteComment(
    user: User,
    commentId: string,
  ): Promise<{ message: string }> {
    const existingComment = await this.prisma.auctionComment.findUnique({
      where: { commentId },
    });

    if (!existingComment) {
      throw new NotFoundException(AUCTION_COMMENT_ERRORS.COMMENT_NOT_FOUND);
    }

    if (existingComment.userId !== (user as any).id && user.role !== Role.ADMIN) {
      throw new ForbiddenException(AUCTION_COMMENT_ERRORS.UNAUTHORIZED_ACCESS);
    }

    await this.prisma.auctionComment.delete({
      where: { commentId },
    });

    return { message: AUCTION_COMMENT_MESSAGES.COMMENT_DELETED };
  }

  async getCommentsByUserId(
    userId: string,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_LIMIT,
  ): Promise<GetAuctionCommentsResponseDto> {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.prisma.auctionComment.findMany({
        where: { userId },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
          auction: {
            select: {
              auctionId: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.auctionComment.count({
        where: { userId },
      }),
    ]);

    const data = comments.map((comment) => this.formatCommentResponse(comment));

    return {
      data,
      total,
      page,
      limit,
      message: AUCTION_COMMENT_MESSAGES.USER_COMMENTS_RETRIEVED,
    };
  }

  private formatCommentResponse(comment: any): AuctionCommentResponseDto {
    return {
      commentId: comment.commentId,
      auctionId: comment.auctionId,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: {
        userId: comment.user.id,
        profile: comment.user.profile
          ? {
              firstName: comment.user.profile.fullName?.split(' ')[0] || '',
              lastName:
                comment.user.profile.fullName?.split(' ').slice(1).join(' ') ||
                '',
              avatar: comment.user.profile.profileImageUrl,
            }
          : undefined,
      },
    };
  }

  // Report-related methods
  async createReport(
    user: any,
    createReportDto: CreateCommentReportDto,
  ): Promise<{ message: string }> {
    // Check if comment exists
    const comment = await this.prisma.auctionComment.findUnique({
      where: { commentId: createReportDto.commentId },
      include: {
        user: true,
      },
    });

    if (!comment) {
      throw new NotFoundException(REPORT_ERRORS.COMMENT_NOT_FOUND);
    }

    // Check if user is trying to report their own comment
    if (comment.userId === (user as any).id) {
      throw new ForbiddenException(REPORT_ERRORS.CANNOT_REPORT_OWN);
    }

    // Check if user has already reported this comment
    const existingReport = await this.prisma.commentReport.findUnique({
      where: {
        commentId_reporterId: {
          commentId: createReportDto.commentId,
          reporterId: (user as any).id,
        },
      },
    });

    if (existingReport) {
      throw new ConflictException(REPORT_ERRORS.ALREADY_REPORTED);
    }

    // Create the report and update comment count in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create the report
      const report = await tx.commentReport.create({
        data: {
          commentId: createReportDto.commentId,
          reporterId: (user as any).id,
          type: createReportDto.type,
          reason: createReportDto.reason,
        },
      });

      // Get current comment data and increment report count
      const currentComment = await tx.auctionComment.findUnique({
        where: { commentId: createReportDto.commentId },
        select: { reportCount: true, isHidden: true },
      });

      if (!currentComment) {
        throw new NotFoundException(REPORT_ERRORS.COMMENT_NOT_FOUND);
      }

      const newReportCount = currentComment.reportCount + 1;
      const shouldAutoHide = newReportCount >= AUTO_HIDE_THRESHOLD && !currentComment.isHidden;

      // Update comment with new report count and potentially hide it
      const updatedComment = await tx.auctionComment.update({
        where: { commentId: createReportDto.commentId },
        data: {
          reportCount: newReportCount,
          isHidden: shouldAutoHide ? true : currentComment.isHidden,
        },
      });

      return { report, updatedComment, shouldAutoHide };
    });

    const { report, updatedComment, shouldAutoHide } = result;

    // Send notification to all admins about new report
    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN },
    });

    // Get the comment with auction information for notification
    const commentWithAuction = await this.prisma.auctionComment.findUnique({
      where: { commentId: createReportDto.commentId },
      include: {
        auction: {
          select: {
            auctionId: true,
            title: true
          }
        }
      }
    });

    console.log('DEBUG: commentWithAuction:', JSON.stringify(commentWithAuction, null, 2));

    const notificationPromises = admins.map((admin) =>
      this.notificationService.createNotification({
        userId: admin.userId,
        message: shouldAutoHide
          ? `Comment has been auto-hidden due to ${updatedComment.reportCount} reports. Report ID: ${report.reportId}`
          : `New comment report received. Report ID: ${report.reportId}`,
        metadata: JSON.stringify({
          type: 'COMMENT_REPORT',
          reportId: report.reportId,
          commentId: createReportDto.commentId,
          auctionId: commentWithAuction?.auction?.auctionId,
          auctionTitle: commentWithAuction?.auction?.title,
          autoHidden: shouldAutoHide,
        }),
      }),
    );

    console.log('DEBUG: Notification metadata will contain auctionId:', commentWithAuction?.auction?.auctionId);

    await Promise.all(notificationPromises);

    return {
      message: shouldAutoHide
        ? REPORT_MESSAGES.COMMENT_HIDDEN
        : REPORT_MESSAGES.REPORT_CREATED,
    };
  }

  async getReports(
    user: any,
    query: GetReportsQueryDto,
  ): Promise<GetCommentReportsResponseDto> {
    // Only admins can view reports
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException(REPORT_ERRORS.UNAUTHORIZED_ACCESS);
    }

    const page = parseInt(query.page || String(DEFAULT_PAGE));
    const limit = parseInt(query.limit || String(DEFAULT_LIMIT));
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (query.status) {
      whereClause.status = query.status;
    }
    if (query.type) {
      whereClause.type = query.type;
    }

    const [reports, total] = await Promise.all([
      this.prisma.commentReport.findMany({
        where: whereClause,
        include: {
          comment: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
              auction: {
                select: {
                  auctionId: true,
                  title: true,
                },
              },
            },
          },
          reporter: {
            include: {
              profile: true,
            },
          },
          reviewer: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.commentReport.count({
        where: whereClause,
      }),
    ]);

    const data = reports.map((report) => this.formatReportResponse(report));

    return {
      data,
      total,
      page,
      limit,
      message: REPORT_MESSAGES.REPORTS_RETRIEVED,
    };
  }

  async updateReportStatus(
    user: any,
    reportId: string,
    updateDto: UpdateReportStatusDto,
  ): Promise<{ message: string }> {
    // Only admins can update report status
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException(REPORT_ERRORS.UNAUTHORIZED_ACCESS);
    }

    const report = await this.prisma.commentReport.findUnique({
      where: { reportId },
      include: {
        comment: true,
      },
    });

    if (!report) {
      throw new NotFoundException(REPORT_ERRORS.REPORT_NOT_FOUND);
    }

    // Update report status and handle comment visibility in a transaction
    await this.prisma.$transaction(async (tx) => {
      // Update report status
      await tx.commentReport.update({
        where: { reportId },
        data: {
          status: updateDto.status as ReportStatus,
          reviewerId: (user as any).id,
          reviewedAt: new Date(),
          adminNote: updateDto.adminNote,
        },
      });

      // Handle comment visibility based on report resolution
      if (updateDto.status === ReportStatus.RESOLVED) {
        // Hide comment if resolved (violation confirmed)
        await tx.auctionComment.update({
          where: { commentId: report.commentId },
          data: { isHidden: true },
        });
      } else if (updateDto.status === ReportStatus.DISMISSED) {
        // Check if we should unhide the comment
        const pendingReportsCount = await tx.commentReport.count({
          where: {
            commentId: report.commentId,
            status: ReportStatus.PENDING,
          },
        });

        // If no pending reports and comment was auto-hidden, unhide it
        if (pendingReportsCount === 0 && report.comment.isHidden) {
          await tx.auctionComment.update({
            where: { commentId: report.commentId },
            data: { isHidden: false },
          });
        }
      }
    });

    return {
      message: REPORT_MESSAGES.REPORT_UPDATED,
    };
  }

  async getReportStats(user: User): Promise<ReportStatsResponseDto> {
    // Only admins can view stats
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException(REPORT_ERRORS.UNAUTHORIZED_ACCESS);
    }

    const [
      totalReports,
      pendingReports,
      resolvedReports,
      dismissedReports,
      autoHiddenComments,
    ] = await Promise.all([
      this.prisma.commentReport.count(),
      this.prisma.commentReport.count({ where: { status: ReportStatus.PENDING } }),
      this.prisma.commentReport.count({ where: { status: ReportStatus.RESOLVED } }),
      this.prisma.commentReport.count({ where: { status: ReportStatus.DISMISSED } }),
      this.prisma.auctionComment.count({ where: { isHidden: true } }),
    ]);

    return {
      totalReports,
      pendingReports,
      resolvedReports,
      dismissedReports,
      autoHiddenComments,
      message: REPORT_MESSAGES.STATS_RETRIEVED,
    };
  }

  async hideComment(
    user: any,
    commentId: string,
  ): Promise<{ message: string }> {
    // Only admins can manually hide comments
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException(AUCTION_COMMENT_ERRORS.UNAUTHORIZED_ACCESS);
    }

    const comment = await this.prisma.auctionComment.findUnique({
      where: { commentId },
    });

    if (!comment) {
      throw new NotFoundException(AUCTION_COMMENT_ERRORS.COMMENT_NOT_FOUND);
    }

    await this.prisma.auctionComment.update({
      where: { commentId },
      data: { isHidden: true },
    });

    return {
      message: REPORT_MESSAGES.COMMENT_HIDDEN,
    };
  }

  async unhideComment(
    user: any,
    commentId: string,
  ): Promise<{ message: string }> {
    // Only admins can manually unhide comments
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException(AUCTION_COMMENT_ERRORS.UNAUTHORIZED_ACCESS);
    }

    const comment = await this.prisma.auctionComment.findUnique({
      where: { commentId },
    });

    if (!comment) {
      throw new NotFoundException(AUCTION_COMMENT_ERRORS.COMMENT_NOT_FOUND);
    }

    await this.prisma.auctionComment.update({
      where: { commentId },
      data: { isHidden: false },
    });

    return {
      message: REPORT_MESSAGES.COMMENT_UNHIDDEN,
    };
  }

  private formatReportResponse(report: any): CommentReportResponseDto {
    return {
      reportId: report.reportId,
      commentId: report.commentId,
      type: report.type,
      reason: report.reason,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      reviewedAt: report.reviewedAt,
      adminNote: report.adminNote,
      comment: report.comment
        ? {
            content: report.comment.content,
            createdAt: report.comment.createdAt,
            auction: {
              auctionId: report.comment.auction.auctionId,
              title: report.comment.auction.title,
            },
            user: {
              userId: (report.comment.user as any).id,
              email: report.comment.user.email,
              profile: report.comment.user.profile
                ? {
                    fullName: report.comment.user.profile.fullName,
                    profileImageUrl:
                      report.comment.user.profile.profileImageUrl,
                  }
                : undefined,
            },
          }
        : undefined,
      reporter: report.reporter
        ? {
            userId: report.reporter.userId,
            email: report.reporter.email,
            profile: report.reporter.profile
              ? {
                  fullName: report.reporter.profile.fullName,
                }
              : undefined,
          }
        : undefined,
      reviewer: report.reviewer
        ? {
            userId: report.reviewer.userId,
            email: report.reviewer.email,
            profile: report.reviewer.profile
              ? {
                  fullName: report.reviewer.profile.fullName,
                }
              : undefined,
          }
        : undefined,
    };
  }
}
