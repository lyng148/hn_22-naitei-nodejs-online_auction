import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import PrismaService from '../../common/services/prisma.service';
import { DOMAIN_EVENTS, NotificationMessages } from '../notification-constants';
import { NotificationService } from '../notification.service';

@Injectable()
export class NotificationAuctionsListener {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService,
  ) { }

  @OnEvent(DOMAIN_EVENTS.BID_CREATED)
  async onBidCreated(payload: { auctionId: string; bidderId: string; bidAmount: number }) {
    const [auction, prevBidders] = await Promise.all([
      this.prisma.auction.findUnique({
        where: { auctionId: payload.auctionId },
        select: { title: true },
      }),
      this.prisma.bid.findMany({
        where: { auctionId: payload.auctionId },
        select: { userId: true },
        distinct: ['userId'],
      }),
    ]);
    if (!auction) return;

    const recipients = prevBidders
      .map(b => b.userId)
      .filter(userId => userId !== payload.bidderId); // chỉ user đã từng bid, bỏ người vừa bid

    if (recipients.length === 0) return;

    await Promise.all(
      recipients.map(userId =>
        this.notificationService.createNotification({
          userId,
          message: NotificationMessages.OUTBID(auction.title, Number(payload.bidAmount)),
          metadata: JSON.stringify({
            type: 'OUTBID',
            auctionId: payload.auctionId,
            bidAmount: Number(payload.bidAmount),
          }),
        }),
      ),
    );
  }

  //Completed
  @OnEvent(DOMAIN_EVENTS.AUCTION_ENDED)
  async onAuctionEnded(payload: { auctionId: string; winnerId?: string; finalPrice: number }) {
    const auction = await this.prisma.auction.findUnique({
      where: { auctionId: payload.auctionId },
      include: {
        bids: { select: { userId: true }, distinct: ['userId'] },
        watchlist: { select: { userId: true } },
      },
    });
    if (!auction) return;

    const followers = await this.prisma.follow.findMany({
      where: { sellerId: auction.sellerId },
      select: { followerId: true },
      distinct: ['followerId'],
    });

    const title = auction.title;
    const finalPrice = Number(payload.finalPrice);
    const winnerId = payload.winnerId || null;

    const bidderIds = Array.from(new Set(auction.bids.map(b => b.userId)));
    const watcherIds = Array.from(new Set(auction.watchlist.map(w => w.userId)));
    const followerIds = Array.from(new Set(followers.map(w => w.followerId)));

    // Chinh minh là Winner
    if (winnerId) {
      await this.notificationService.createNotification({
        userId: winnerId,
        message: NotificationMessages.AUCTION_ENDED_WINNER(title, finalPrice),
        metadata: JSON.stringify({ type: 'AUCTION_ENDED', role: 'WINNER', auctionId: auction.auctionId }),
      });
    }

    // Có người khác Winner → gửi cho tất cả bidder thua
    const loserIds = bidderIds.filter(id => id !== winnerId);
    await Promise.all(loserIds.map(userId =>
      this.notificationService.createNotification({
        userId,
        message: NotificationMessages.AUCTION_ENDED_LOSER(title, finalPrice),
        metadata: JSON.stringify({ type: 'AUCTION_ENDED', role: 'LOSER', auctionId: auction.auctionId, finalPrice }),
      })
    ));

    // Auction mà đã WatchList completed → gửi cho watchers không nằm trong (winner + bidders)
    const watcherOnlyIds = watcherIds.filter(id => id !== winnerId && !bidderIds.includes(id));
    await Promise.all(watcherOnlyIds.map(userId =>
      this.notificationService.createNotification({
        userId,
        message: NotificationMessages.AUCTION_ENDED_WATCHER(title, finalPrice),
        metadata: JSON.stringify({ type: 'AUCTION_ENDED', role: 'WATCHER', auctionId: auction.auctionId, finalPrice }),
      })
    ));

    const followerOnlyIds = watcherIds.filter(id => id !== winnerId && !bidderIds.includes(id));
    await Promise.all(watcherOnlyIds.map(userId =>
      this.notificationService.createNotification({
        userId,
        message: NotificationMessages.AUCTION_ENDED_FOLLOWER(title, finalPrice),
        metadata: JSON.stringify({ type: 'AUCTION_ENDED', role: 'FOLLOWER', auctionId: auction.auctionId, finalPrice }),
      })
    ));
  }

  @OnEvent(DOMAIN_EVENTS.AUCTION_STATUS_CHANGED)
  async onAuctionClosed(payload: { auctionId: string; status: string }) {
    if (payload.status !== 'CLOSED') return;

    const auction = await this.prisma.auction.findUnique({
      where: { auctionId: payload.auctionId },
      select: {
        auctionId: true,
        title: true,
        sellerId: true,
        currentPrice: true,
      },
    });
    if (!auction) return;

    // 1) Tất cả bidder đã từng bid
    const bidders = await this.prisma.bid.findMany({
      where: { auctionId: auction.auctionId },
      select: { userId: true },
      distinct: ['userId'],
    });

    // 2) Tất cả follower của SELLER
    const followers = await this.prisma.follow.findMany({
      where: { sellerId: auction.sellerId },
      select: { followerId: true },
      distinct: ['followerId'],
    });

    // 3) Tất cả watcher của auction
    const watchers = await this.prisma.watchlist.findMany({
      where: { auctionId: auction.auctionId },
      select: { userId: true },
      distinct: ['userId'],
    });

    // 4) SELLER chủ auction
    const sellerId = auction.sellerId;

    const title = auction.title;

    // Gửi riêng cho SELLER
    await this.notificationService.createNotification({
      userId: sellerId,
      message: NotificationMessages.AUCTION_CLOSED_SELLER(title),
      metadata: JSON.stringify({ type: 'AUCTION_CLOSED', role: 'SELLER', auctionId: auction.auctionId }),
    });

    // Hợp nhất người nhận BIDDER, FOLLOWER, WATCHER để chỉ gửi 1 lần cho mỗi user
    const bidderIds = new Set(bidders.map(b => b.userId));
    const followerIds = new Set(followers.map(f => f.followerId));
    const watcherIds = new Set(watchers.map(w => w.userId));

    const ROLE_PRIORITY = { BIDDER: 3, FOLLOWER: 2, WATCHER: 1 } as const;
    type RoleKey = keyof typeof ROLE_PRIORITY;
    const chooseHigherRole = (current: RoleKey | undefined, incoming: RoleKey): RoleKey =>
      !current || ROLE_PRIORITY[incoming] > ROLE_PRIORITY[current] ? incoming : current;

    const userRoleMap = new Map<string, RoleKey>();

    // Gửi với thứ tự ưu tiên: BIDDER > FOLLOWER > WATCHER
    for (const userId of Array.from(bidderIds)) {
      userRoleMap.set(userId, chooseHigherRole(userRoleMap.get(userId), 'BIDDER'));
    }
    for (const userId of Array.from(followerIds)) {
      userRoleMap.set(userId, chooseHigherRole(userRoleMap.get(userId), 'FOLLOWER'));
    }
    for (const userId of Array.from(watcherIds)) {
      userRoleMap.set(userId, chooseHigherRole(userRoleMap.get(userId), 'WATCHER'));
    }

    await Promise.all(
      Array.from(userRoleMap.entries()).map(([userId, role]) => {
        let message: string;
        switch (role) {
          case 'BIDDER':
            message = NotificationMessages.AUCTION_BIDDER_CLOSED(title);
            break;
          case 'FOLLOWER':
            message = NotificationMessages.AUCTION_FOLLOWER_CLOSED(title);
            break;
          case 'WATCHER':
          default:
            message = NotificationMessages.AUCTION_WATCHER_CLOSED(title);
            break;
        }

        return this.notificationService.createNotification({
          userId,
          message,
          metadata: JSON.stringify({
            type: 'AUCTION_CLOSED',
            role,
            auctionId: auction.auctionId,
          }),
        });
      }),
    );
  }

  @OnEvent(DOMAIN_EVENTS.AUCTION_STATUS_CHANGED)
  async onAuctionPending(payload: { auctionId: string; status: string }) {
    const status = (payload.status || '').toUpperCase();
    if (status !== 'PENDING') return;

    const auction = await this.prisma.auction.findUnique({
      where: { auctionId: payload.auctionId },
      select: {
        auctionId: true,
        title: true,
        sellerId: true,
      },
    });
    if (!auction) return;

    await this.notificationService.createNotification({
      userId: auction.sellerId,
      message: NotificationMessages.AUCTION_PENDING_SELLER(auction.title),
      metadata: JSON.stringify({
        type: 'AUCTION_PENDING',
        role: 'SELLER',
        auctionId: auction.auctionId,
        status,
      }),
    });
  }

  @OnEvent(DOMAIN_EVENTS.AUCTION_STATUS_CHANGED)
  async onAuctionCanceled(payload: { auctionId: string; status: string }) {
    const status = (payload.status || '').toUpperCase();
    if (status !== 'CANCELED') return;

    const auction = await this.prisma.auction.findUnique({
      where: { auctionId: payload.auctionId },
      select: {
        auctionId: true,
        title: true,
        sellerId: true,
      },
    });
    if (!auction) return;

    await this.notificationService.createNotification({
      userId: auction.sellerId,
      message: NotificationMessages.AUCTION_CANCELED_SELLER(auction.title),
      metadata: JSON.stringify({
        type: 'AUCTION_CANCELED',
        role: 'SELLER',
        auctionId: auction.auctionId,
        status,
      }),
    });
  }

  @OnEvent(DOMAIN_EVENTS.AUCTION_STATUS_CHANGED)
  async onAuctionReady(payload: { auctionId: string; status: string }) {
    if (payload.status !== 'READY') return;

    const auction = await this.prisma.auction.findUnique({
      where: { auctionId: payload.auctionId },
      select: {
        auctionId: true,
        title: true,
        sellerId: true,
        currentPrice: true,
      },
    });
    if (!auction) return;


    // Tất cả follower của SELLER
    const followers = await this.prisma.follow.findMany({
      where: { sellerId: auction.sellerId },
      select: { followerId: true },
      distinct: ['followerId'],
    });

    const sellerId = auction.sellerId;

    const title = auction.title;

    await this.notificationService.createNotification({
      userId: sellerId,
      message: NotificationMessages.AUCTION_READY_SELLER(title),
      metadata: JSON.stringify({ type: 'AUCTION_READY', role: 'SELLER', auctionId: auction.auctionId }),
    });

    const followerIds = Array.from(new Set(followers.map(f => f.followerId)))


    await Promise.all(
      followerIds.map(userId =>
        this.notificationService.createNotification({
          userId,
          message: NotificationMessages.AUCTION_READY_FOLLOWER(title),
          metadata: JSON.stringify({
            type: 'AUCTION_READY',
            role: 'FOLLOWER',
            auctionId: auction.auctionId,
          }),
        })
      )
    );
  }

  @OnEvent(DOMAIN_EVENTS.AUCTION_STATUS_CHANGED)
  async onAuctionOpen(payload: { auctionId: string; status: string; previousStatus?: string }) {
    if (payload.status !== 'OPEN') return;

    const auction = await this.prisma.auction.findUnique({
      where: { auctionId: payload.auctionId },
      select: {
        auctionId: true,
        title: true,
        sellerId: true,
        currentPrice: true,
      },
    });
    if (!auction) return;

    const title = auction.title;
    const sellerId = auction.sellerId;
    const previousStatus = payload.previousStatus?.toUpperCase();

    await this.notificationService.createNotification({
      userId: sellerId,
      message: NotificationMessages.AUCTION_OPEN_SELLER(title),
      metadata: JSON.stringify({
        type: 'AUCTION_OPEN',
        role: 'SELLER',
        auctionId: auction.auctionId,
        previousStatus
      }),
    });

    // Lấy tất cả follower của SELLER
    const followers = await this.prisma.follow.findMany({
      where: { sellerId: auction.sellerId },
      select: { followerId: true },
      distinct: ['followerId'],
    });

    const followerIds = Array.from(new Set(followers.map(f => f.followerId)));

    // Gửi thông báo cho tất cả follower
    await Promise.all(
      followerIds.map(userId =>
        this.notificationService.createNotification({
          userId,
          message: NotificationMessages.AUCTION_OPEN_FOLLOWER(title),
          metadata: JSON.stringify({
            type: 'AUCTION_OPEN',
            role: 'FOLLOWER',
            auctionId: auction.auctionId,
            previousStatus,
          }),
        })
      )
    );

    // Trường hợp: Nếu từ READY -> OPEN: thêm thông báo cho WATCHER
    if (previousStatus === 'READY') {
      const watchers = await this.prisma.watchlist.findMany({
        where: { auctionId: auction.auctionId },
        select: { userId: true },
        distinct: ['userId'],
      });

      const watcherIds = Array.from(new Set(watchers.map(w => w.userId)));
      const followerIdSet = new Set(followerIds);
      const watcherOnlyIds = watcherIds.filter(userId => !followerIdSet.has(userId));

      // Gửi thông báo cho tất cả watcher
      await Promise.all(
        watcherOnlyIds.map(userId =>
          this.notificationService.createNotification({
            userId,
            message: NotificationMessages.AUCTION_OPEN_WATCHER(title),
            metadata: JSON.stringify({
              type: 'AUCTION_OPEN',
              role: 'WATCHER',
              auctionId: auction.auctionId,
              previousStatus,
            }),
          })
        )
      );
    }
  }
}
