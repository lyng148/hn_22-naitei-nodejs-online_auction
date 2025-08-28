/**
 * Format number as VND currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted VND currency string
 */
export const formatVND = (amount) => {
  if (!amount && amount !== 0) return '0 VND';
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('₫', 'VND');
};

/**
 * Format number as USD currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted USD currency string
 */
export const formatUSD = (amount) => {
  if (!amount && amount !== 0) return '$0';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format number with thousand separators
 * @param {number} amount - The amount to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (amount) => {
  if (!amount && amount !== 0) return '0';
  
  return new Intl.NumberFormat('vi-VN').format(amount);
};

/**
 * Format date to Vietnamese locale
 * @param {Date|string} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  return new Intl.DateTimeFormat('vi-VN', defaultOptions).format(new Date(date));
};

/**
 * Format date to short format (DD/MM/YYYY)
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDateShort = (date) => {
  return formatDate(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};
