export const WALLET_CONFIG = {
  MIN_DEPOSIT_AMOUNT: 100000, // 100,000 VND
  MAX_DEPOSIT_AMOUNT: 1000000000, // 1,000,000,000 VND
};

export const WALLET_ERRORS = {
  INVALID_DEPOSIT_AMOUNT: {
    statusCode: 400,
    message: `Số tiền nạp phải từ ${WALLET_CONFIG.MIN_DEPOSIT_AMOUNT.toLocaleString('vi-VN')} đến ${WALLET_CONFIG.MAX_DEPOSIT_AMOUNT.toLocaleString('vi-VN')} VND`,
    errorCode: 'INVALID_DEPOSIT_AMOUNT',
  },

  AUCTION_NOT_FOUND: {
    statusCode: 404,
    message: 'Không tìm thấy phiên đấu giá',
    errorCode: 'AUCTION_NOT_FOUND',
  },

  AUCTION_NOT_OPEN: {
    statusCode: 400,
    message: 'Phiên đấu giá không đang mở',
    errorCode: 'AUCTION_NOT_OPEN',
  },

  CANNOT_BID_OWN_AUCTION: {
    statusCode: 400,
    message: 'Không thể đấu giá sản phẩm của chính mình',
    errorCode: 'CANNOT_BID_OWN_AUCTION',
  },

  INSUFFICIENT_BALANCE: {
    statusCode: 400,
    message: 'Số dư ví không đủ để đặt bid',
    errorCode: 'INSUFFICIENT_WALLET_BALANCE',
  },

  USER_NOT_FOUND: {
    statusCode: 404,
    message: 'Không tìm thấy người dùng',
    errorCode: 'USER_NOT_FOUND',
  },

  INSUFFICIENT_BALANCE_FOR_ADJUSTMENT: {
    statusCode: 400,
    message: 'Số dư không đủ để thực hiện điều chỉnh',
    errorCode: 'INSUFFICIENT_BALANCE_FOR_ADJUSTMENT',
  },
};

export const TRANSACTION_DESCRIPTIONS = {
  DEPOSIT: (amount: number) => `Nạp ${amount.toLocaleString('vi-VN')} VND vào ví`,

  BID_PAYMENT: (amount: number, auctionTitle: string) =>
    `Đặt bid ${amount.toLocaleString('vi-VN')} VND cho phiên đấu giá: ${auctionTitle}`,

  BID_REFUND: (amount: number, auctionTitle: string) =>
    `Hoàn tiền bid ${amount.toLocaleString('vi-VN')} VND cho phiên đấu giá: ${auctionTitle}`,

  ADMIN_ADJUSTMENT: (amount: number) =>
    `Admin ${amount > 0 ? 'cộng' : 'trừ'} ${Math.abs(amount).toLocaleString('vi-VN')} VND`,
};

export const formatBidMinimumError = (minimumBid: string) =>
  `Số tiền bid phải lớn hơn ${minimumBid} VND`;

export const PAGE_DEFAULT = 1;

export const LIMIT_DEFAULT = 20;
