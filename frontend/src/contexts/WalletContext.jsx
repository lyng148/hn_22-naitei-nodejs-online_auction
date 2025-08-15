import React, { createContext, useContext, useState, useEffect } from 'react';
import { walletService } from '@/services/wallet.service';
import { useNotification } from './NotificationContext';
import { useUser } from './UserContext';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [formattedBalance, setFormattedBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const { showToastNotification } = useNotification();
  const { user } = useUser();

  const fetchBalance = async () => {
    if (!user?.id || user?.role !== 'BIDDER') return;

    try {
      setLoading(true);
      const response = await walletService.getBalance();
      setBalance(parseFloat(response.walletBalance));
      setFormattedBalance(response.formattedBalance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setFormattedBalance('0');
    } finally {
      setLoading(false);
    }
  };

  const addFunds = async (amount, description) => {
    try {
      setLoading(true);
      const response = await walletService.addFunds(amount, description);

      // Refresh balance after successful add funds
      await fetchBalance();

      showToastNotification?.('Nạp tiền thành công!', 'success');
      return response;
    } catch (error) {
      showToastNotification?.(
        error.message || 'Nạp tiền thất bại!',
        'error'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (params = {}) => {
    try {
      const response = await walletService.getTransactions(params);
      setTransactions(response.transactions || []);
      return response;
    } catch (error) {
      showToastNotification?.('Không thể tải lịch sử giao dịch', 'error');
      throw error;
    }
  };

  // Auto-fetch balance when user changes
  useEffect(() => {
    if (user?.id && user?.role === 'BIDDER') {
      fetchBalance();
    } else {
      setBalance(0);
      setFormattedBalance('0');
      setTransactions([]);
    }
  }, [user]);

  const value = {
    balance,
    formattedBalance,
    loading,
    transactions,
    fetchBalance,
    addFunds,
    fetchTransactions
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
