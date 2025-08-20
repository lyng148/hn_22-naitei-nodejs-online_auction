export const LIMIT_NOTIFICATION_DEFAULT = 10;
export const OFFSET_NOTIFICATION_DEFAULT = 0;

export const NOTIFICATION_QUEUE = 'queue/notifications';

export enum NotificationType {
  OUTBID = 'OUTBID',
  AUCTION_CLOSED = 'AUCTION_CLOSED',

}
export const SEND_NOTIFICATION_ERROR = 'Failed to send notification';
export const ERROR_NOT_FOUND_NOTIFICATION = 'Notification not found';
export const ERROR_ALREADY_MARKED_AS_READ = 'Notification is already marked as read';

export const NOTIFICATION_EVENTS = {
  NEW_NOTIFICATION: 'new_notification',
  MARK_AS_READ: 'mark_as_read',
  MARK_ALL_AS_READ: 'mark_all_as_read',
};

export const SUCCESS_NOTIFICATION_MESSAGES = {
  SINGLE: 'Notification marked as read',
  ALL: 'All notifications marked as read',
};

export const NotificationMessages = {
  OUTBID: (title: string, bidAmount: number) =>
    `Bạn đã bị vượt giá ở ${title}! Giá mới: ${bidAmount.toLocaleString()}₫`,
  AUCTION_ENDED_WINNER: (title: string, price: number) =>
    `Chúc mừng! Bạn đã thắng phiên đấu giá ${title} với giá ${price.toLocaleString()}₫`,
  AUCTION_ENDED_LOSER: (title: string, price: number) =>
    `Phiên đấu giá ${title} đã kết thúc, giá cuối cùng là ${price.toLocaleString()}₫. Bạn đã thua, hãy tham gia phiên đấu giá khác nhé! Cố lên!`,
  AUCTION_ENDED_WATCHER: (title: string, price: number) =>
    `Phiên đấu giá ${title} đã kết thúc, giá cuối cùng là ${price.toLocaleString()}₫. Bạn đã theo dõi phiên đấu giá này, hãy tham gia phiên đấu giá khác nhé!`,
  AUCTION_ENDED_FOLLOWER: (title: string, price: number) =>
    `Phiên đấu giá ${title} đã kết thúc, giá cuối cùng là ${price.toLocaleString()}₫. Bạn đã theo dõi chủ sở hữu phiên đấu giá này, hãy tham gia phiên đấu giá khác nhé!`,


  AUCTION_BIDDER_CLOSED: (title: string) =>
    `Phiên đấu giá ${title} đã bị đóng. Bạn đã tham gia phiên đấu giá này, hãy tham gia phiên đấu giá khác nhé!`,
  AUCTION_FOLLOWER_CLOSED: (title: string) =>
    `Phiên đấu giá ${title} đã bị đóng. Bạn đã theo dõi chủ sở hữu phiên đấu giá này, hãy tham gia phiên đấu giá khác nhé!`,
  AUCTION_WATCHER_CLOSED: (title: string) =>
    `Phiên đấu giá ${title} đã bị đóng. Bạn đã theo dõi phiên đấu giá này, hãy tham gia phiên đấu giá khác nhé!`,
  AUCTION_CLOSED_SELLER: (title: string) =>
    `Phiên đấu giá của bạn "${title}" đã bị đóng.`,

  AUCTION_CANCELED_SELLER: (title: string) =>
    `Phiên đấu giá của bạn "${title}" đã bị ADMIN hủy.`,
  AUCTION_PENDING_SELLER: (title: string) =>
    `Phiên đấu giá của bạn "${title}" đang ở trạng thái chờ xử lý.`,

  AUCTION_READY_SELLER: (title: string) =>
    `Phiên đấu giá của bạn "${title}" đã được ADMIN duyệt, chuẩn bị lên sàn đấu giá!`,
  AUCTION_READY_FOLLOWER: (title: string) =>
    `Phiên đấu giá "${title}" chuẩn bị lên sàn. Bạn đã theo dõi chủ sở hữu phiên đấu giá này. Hãy tham gia ngay nào!`,

  AUCTION_OPEN_SELLER: (title: string) =>
    `Phiên đấu giá của bạn "${title}" đã chính thức mở!`,
  AUCTION_OPEN_FOLLOWER: (title: string) =>
    `Phiên đấu giá "${title}" đã chính thức mở! Bạn đã theo dõi chủ sở hữu phiên đấu giá này. Hãy tham gia ngay nào!`,
  AUCTION_OPEN_WATCHER: (title: string) =>
    `Phiên đấu giá "${title}" đã chính thức mở! Bạn đã theo dõi phiên đấu giá này. Hãy tham gia ngay nào!`,

  FOLLOW_CREATED: (user: string) =>
    `Bạn đã theo dõi ${user}`,
};

export const DOMAIN_EVENTS = {
  AUCTION_ENDED: 'auction_ended',
  BID_CREATED: 'bid_created',
  WATCHLIST_UPDATED: 'watchlist_updated',
  FOLLOW_CREATED: 'follow_created',
  AUCTION_STATUS_CHANGED: 'auction_status_changed',
};
