import axiosClient from "@/utils/axios.js";

const WALLET_API = {
  ADD_FUNDS: '/api/wallet/add-funds',
  GET_BALANCE: '/api/wallet/balance',
  GET_TRANSACTIONS: '/api/wallet/transactions',
};

export const walletService = {
  // Nạp tiền vào ví
  async addFunds(amount, description) {
    try {
      const response = await axiosClient.post(WALLET_API.ADD_FUNDS, {
        amount,
        description
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy số dư ví
  async getBalance() {
    try {
      const response = await axiosClient.get(WALLET_API.GET_BALANCE);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy lịch sử giao dịch
  async getTransactions(params = {}) {
    try {
      const response = await axiosClient.get(WALLET_API.GET_TRANSACTIONS, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
