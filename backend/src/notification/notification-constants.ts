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
  OUTBID: (productName: string, bidAmount: number) =>
    `Bạn đã bị vượt giá ở ${productName}! Giá mới: ${bidAmount.toLocaleString()}₫`,
  AUCTION_WIN: (title: string, price: number) =>
    `Chúc mừng! Bạn đã thắng phiên đấu giá ${title} với giá ${price.toLocaleString()}₫`,
  AUCTION_CLOSED: (title: string, price: number) =>
    `Phiên đấu giá ${title} đã kết thúc. Giá cuối cùng: ${price.toLocaleString()}₫`,
  WATCHLIST_CLOSED: (title: string, price: number) =>
    `Phiên đấu giá bạn theo dõi đã kết thúc: ${title}. Giá cuối cùng: ${price.toLocaleString()}₫`,
};
