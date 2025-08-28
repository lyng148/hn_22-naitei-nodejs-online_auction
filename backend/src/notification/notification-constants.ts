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
    `You have been outbid in ${title}! New price: ${bidAmount.toLocaleString()}$`,
  AUCTION_ENDED_WINNER: (title: string, price: number) =>
    `Congratulations! You won the auction ${title} with a price of ${price.toLocaleString()}$`,
  AUCTION_ENDED_LOSER: (title: string, price: number) =>
    `The auction ${title} has ended, final price is ${price.toLocaleString()}$. You lost, please join another auction! Keep trying!`,
  AUCTION_ENDED_WATCHER: (title: string, price: number) =>
    `The auction ${title} has ended, final price is ${price.toLocaleString()}$. You were watching this auction, please join another auction!`,
  AUCTION_ENDED_FOLLOWER: (title: string, price: number) =>
    `The auction ${title} has ended, final price is ${price.toLocaleString()}$. You were following the owner of this auction, please join another auction!`,
  AUCTION_ENDED_SELLER: (title: string, price: number) =>
  `Your auction "${title}" has ended. Final price: ${price.toLocaleString()}$`,

  AUCTION_BIDDER_CLOSED: (title: string) =>
    `The auction ${title} has been closed. You participated in this auction, please join another auction!`,
  AUCTION_FOLLOWER_CLOSED: (title: string) =>
    `The auction ${title} has been closed. You were following the owner of this auction, please join another auction!`,
  AUCTION_WATCHER_CLOSED: (title: string) =>
    `The auction ${title} has been closed. You were watching this auction, please join another auction!`,
  AUCTION_CLOSED_SELLER: (title: string) =>
    `Your auction "${title}" has been closed.`,

  AUCTION_CANCELED_SELLER: (title: string) =>
    `Your auction "${title}" has been canceled by ADMIN.`,
  AUCTION_PENDING_SELLER: (title: string) =>
    `Your auction "${title}" is pending approval.`,

  AUCTION_READY_SELLER: (title: string) =>
    `Your auction "${title}" has been approved by ADMIN and is ready to go live!`,
  AUCTION_READY_FOLLOWER: (title: string) =>
    `Auction "${title}" is about to go live. You are following the owner of this auction. Join now!`,

  AUCTION_OPEN_SELLER: (title: string) =>
    `Your auction "${title}" is now officially open!`,
  AUCTION_OPEN_FOLLOWER: (title: string) =>
    `Auction "${title}" is now officially open! You are following the owner of this auction. Join now!`,
  AUCTION_OPEN_WATCHER: (title: string) =>
    `Auction "${title}" is now officially open! You were watching this auction. Join now!`,

  FOLLOW_CREATED: (user: string) =>
    `You have been followed by ${user}`,
  WARNING_CREATED: (warningCount: number) =>
    `You have received warning number ${warningCount}`,

  BAND: (user: string) =>
    `You have been banned from using the website`,
  UNBAND: (user: string) =>
    `You are allowed to use the website again`,
};

export const DOMAIN_EVENTS = {
  AUCTION_ENDED: 'auction_ended',
  BID_CREATED: 'bid_created',
  WATCHLIST_UPDATED: 'watchlist_updated',
  FOLLOW_CREATED: 'follow_created',
  AUCTION_STATUS_CHANGED: 'auction_status_changed',
  WARNING_CREATED: 'warning_created',
  BAND: 'band',
  UNBAND: 'unband'
};
