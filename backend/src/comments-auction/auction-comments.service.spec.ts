import { Test, TestingModule } from '@nestjs/testing';
import { AuctionCommentsService } from './auction-comments.service';
import PrismaService from '@common/services/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Role, ReportType } from '@prisma/client';

describe('AuctionCommentsService - Report Feature', () => {
  let service: AuctionCommentsService;
  let prisma: PrismaService;
  let notificationService: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionCommentsService,
        {
          provide: PrismaService,
          useValue: {
            auctionComment: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            commentReport: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
            user: {
              findMany: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            createNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuctionCommentsService>(AuctionCommentsService);
    prisma = module.get<PrismaService>(PrismaService);
    notificationService = module.get<NotificationService>(NotificationService);
  });

  describe('createReport', () => {
    const mockUser = {
      userId: 'user-1',
      email: 'user@test.com',
      role: Role.BIDDER,
    };

    const mockComment = {
      commentId: 'comment-1',
      userId: 'other-user',
      content: 'Test comment',
    };

    const createReportDto = {
      commentId: 'comment-1',
      type: ReportType.INAPPROPRIATE_LANGUAGE,
      reason: 'This comment contains inappropriate language',
    };

    it('should successfully create a report', async () => {
      // Mock transaction
      const mockTransactionResult = {
        report: { reportId: 'report-1', ...createReportDto },
        updatedComment: { ...mockComment, reportCount: 1, isHidden: false },
        shouldAutoHide: false,
      };
      
      (prisma.$transaction as jest.Mock).mockResolvedValue(mockTransactionResult);

      // Mock comment exists and not owned by reporter
      (prisma.auctionComment.findUnique as jest.Mock).mockResolvedValue(mockComment);
      
      // Mock no existing report
      (prisma.commentReport.findUnique as jest.Mock).mockResolvedValue(null);
      
      // Mock admin users
      const mockAdmins = [{ userId: 'admin-1', role: Role.ADMIN }];
      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockAdmins);
      
      // Mock notification service
      (notificationService.createNotification as jest.Mock).mockResolvedValue({});

      const result = await service.createReport(mockUser as any, createReportDto);

      expect(result.message).toBeDefined();
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(notificationService.createNotification).toHaveBeenCalled();
    });

    it('should throw NotFoundException when comment does not exist', async () => {
      (prisma.auctionComment.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.createReport(mockUser as any, createReportDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when user already reported the comment', async () => {
      (prisma.auctionComment.findUnique as jest.Mock).mockResolvedValue(
        mockComment,
      );
      (prisma.commentReport.findUnique as jest.Mock).mockResolvedValue({
        reportId: 'existing',
      });

      await expect(
        service.createReport(mockUser as any, createReportDto),
      ).rejects.toThrow(ConflictException);
    });
  });
});
