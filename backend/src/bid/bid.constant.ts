export const ERROR_AUCTION_NOT_FOUND = {
  statusCode: 404,
  message: 'Auction not found',
  errorCode: 'AUCTION_NOT_FOUND',
};

export const ERROR_AUCTION_NOT_OPEN = {
  statusCode: 400,
  message: 'Auction is not open for bidding',
  errorCode: 'AUCTION_NOT_OPEN',
};

export const ERROR_BID_LESS_THAN_MINIMUM = {
  statusCode: 400,
  message: 'Bid amount is less than the minimum acceptable bid',
  errorCode: 'BID_TOO_LOW',
};

export const ERROR_BID_CONSECUTIVE = {
  statusCode: 400,
  message: 'You cannot place two consecutive bids in the same auction',
  errorCode: 'BID_CONSECUTIVE',
};

export const ERROR_INSUFFICIENT_BALANCE = {
  statusCode: 400,
  message: 'Insufficient wallet balance to place this bid',
  errorCode: 'INSUFFICIENT_BALANCE',
};

export const ERROR_BID_NOT_MULTIPLE_OF_INCREMENT = {
  statusCode: 400,
  message: 'Bid amount must be a multiple of the minimum increment',
  errorCode: 'BID_NOT_MULTIPLE_OF_INCREMENT',
};

export const ERROR_AUCTION_ALREADY_ENDED = {
  statusCode: 400,
  errorCode: 'AUCTION_ALREADY_ENDED',
  message: 'Auction has already ended',
};

export const ERROR_BID_NOT_ELIGIBLE_LAST_PHASE = {
  statusCode: 400,
  errorCode: 'BID_NOT_ELIGIBLE_LAST_PHASE',
  message:
    'User must have placed a valid bid before to participate in the last 10 minutes',
};

export const ERROR_BID_LAST_PHASE_LIMIT = {
  statusCode: 400,
  errorCode: 'BID_LAST_PHASE_LIMIT',
  message: 'User can only place up to 3 hidden bids in the last 10 minutes',
};

export const ERROR_BID_ARRAY_INVALID = {
  statusCode: 400,
  errorCode: 'BID_ARRAY_INVALID',
  message: 'You can submit 1 to 3 hidden bids at once.',
};

export const ERROR_BID_ONLY_HIDDEN_IN_LAST_PHASE = {
  statusCode: 400,
  errorCode: 'BID_ONLY_HIDDEN_IN_LAST_PHASE',
  message:
    'Bids can only be submitted as hidden bids during the last 10 minutes of the auction',
};

export const ERROR_BID_ONLY_LAST_10_MINUTES = {
  statusCode: 400,
  errorCode: 'BID_ONLY_LAST_10_MINUTES',
  message: 'This API is only for the last 10 minutes.',
};