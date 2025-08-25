export const MAX_CONTENT_LENGTH = 1000;
export const MIN_CONTENT_LENGTH = 1;

// Pagination constants
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

// Report constants
export const AUTO_HIDE_THRESHOLD = 3; // Auto hide comment after 3 reports

// Error messages
export const AUCTION_COMMENT_ERRORS = {
  AUCTION_NOT_FOUND: 'Auction not found',
  COMMENT_NOT_FOUND: 'Auction comment not found',
  UNAUTHORIZED_ACCESS: 'You are not authorized to perform this action',
  CONTENT_TOO_LONG: `Comment content must not exceed ${MAX_CONTENT_LENGTH} characters`,
  CONTENT_TOO_SHORT: `Comment content must be at least ${MIN_CONTENT_LENGTH} character long`,
} as const;

// Report error messages
export const REPORT_ERRORS = {
  COMMENT_NOT_FOUND: 'Comment not found',
  REPORT_NOT_FOUND: 'Report not found',
  ALREADY_REPORTED: 'You have already reported this comment',
  CANNOT_REPORT_OWN: 'You cannot report your own comment',
  UNAUTHORIZED_ACCESS: 'You are not authorized to perform this action',
} as const;

// Success messages
export const AUCTION_COMMENT_MESSAGES = {
  COMMENTS_RETRIEVED: 'Comments retrieved successfully',
  COMMENT_DELETED: 'Comment deleted successfully',
  USER_COMMENTS_RETRIEVED: 'User comments retrieved successfully',
} as const;

// Report success messages
export const REPORT_MESSAGES = {
  REPORT_CREATED: 'Report submitted successfully',
  REPORTS_RETRIEVED: 'Reports retrieved successfully',
  REPORT_UPDATED: 'Report status updated successfully',
  COMMENT_HIDDEN: 'Comment has been hidden due to multiple reports',
  COMMENT_UNHIDDEN: 'Comment has been restored',
  STATS_RETRIEVED: 'Report statistics retrieved successfully',
} as const;
