export const ERROR_INVALID_AUCTION_TIME = {
  statusCode: 400,
  message: 'Start time must be before end time',
  errorCode: 'INVALID_AUCTION_TIME',
};

export const ERROR_PRODUCT_NOT_FOUND = {
  statusCode: 404,
  message: 'One or more products not found',
  errorCode: 'PRODUCT_NOT_FOUND',
};

export const ERROR_PRODUCT_STOCK_INSUFFICIENT = (productId: string) => ({
  statusCode: 400,
  message: `Insufficient stock for product ${productId}`,
  errorCode: 'INSUFFICIENT_PRODUCT_STOCK',
});

export const ERROR_AUCTION_START_TIME_IN_PAST = (minDate: Date) => ({
  statusCode: 400,
  message: `Start time must be in the future (>= ${minDate.toString()})`,
  errorCode: 'INVALID_AUCTION_START_TIME',
});

export const ERROR_AUCTION_NOT_FOUND = {
  statusCode: 404,
  message: 'Auction not found',
  errorCode: 'AUCTION_NOT_FOUND',
};

export const ERROR_AUCTION_NOT_PENDING = {
  statusCode: 400,
  message: 'Only auctions in PENDING status can be evaluated for opening.',
  errorCode: 'AUCTION_NOT_PENDING',
};
