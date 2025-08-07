import axiosClient from "@/utils/axios.js";

const USER_API = {
  GET_ACCOUNT_INFO: (userId) => `/api/profile/${userId}/accountInfo`,
  UPDATE_PROFILE: (userId) => `/api/profile/${userId}`,
  VERIFY_EMAIL: (userId) => `/api/profile/${userId}/verify-email`,
  VERIFY_PHONE: (userId) => `/api/profile/${userId}/verify-phone`,
  UPLOAD_AVATAR: (userId) => `/api/profile/${userId}/upload-avatar`,
};

export const userService = {
  // Get user account information
  getUserAccountInfo: async (userId) => {
    try {
      const response = await axiosClient.get(USER_API.GET_ACCOUNT_INFO(userId));
      return response.data;
    } catch (err) {
      const { message } = err?.response?.data || {};
      throw {
        response: {
          data: {
            message: message || 'Failed to get user account info'
          }
        },
        message: message || 'Failed to get user account info',
        statusCode: err?.response?.status || 500,
      };
    }
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    try {
      const response = await axiosClient.put(
        USER_API.UPDATE_PROFILE(userId),
        profileData
      );
      return response.data;
    } catch (err) {
      const { message } = err?.response?.data || {};
      throw {
        response: {
          data: {
            message: message || 'Failed to update profile'
          }
        },
        message: message || 'Failed to update profile',
        statusCode: err?.response?.status || 500,
      };
    }
  },

  // Verify email
  verifyEmail: async (userId) => {
    try {
      const response = await axiosClient.post(USER_API.VERIFY_EMAIL(userId));
      return response.data;
    } catch (err) {
      const { message } = err?.response?.data || {};
      throw {
        response: {
          data: {
            message: message || 'Failed to verify email'
          }
        },
        message: message || 'Failed to verify email',
        statusCode: err?.response?.status || 500,
      };
    }
  },

  // Verify phone
  verifyPhone: async (userId) => {
    try {
      const response = await axiosClient.post(USER_API.VERIFY_PHONE(userId));
      return response.data;
    } catch (err) {
      const { message } = err?.response?.data || {};
      throw {
        response: {
          data: {
            message: message || 'Failed to verify phone'
          }
        },
        message: message || 'Failed to verify phone',
        statusCode: err?.response?.status || 500,
      };
    }
  },

  // Upload avatar
  uploadAvatar: async (userId, file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axiosClient.post(
        USER_API.UPLOAD_AVATAR(userId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (err) {
      const { message } = err?.response?.data || {};
      throw {
        response: {
          data: {
            message: message || 'Failed to upload avatar'
          }
        },
        message: message || 'Failed to upload avatar',
        statusCode: err?.response?.status || 500,
      };
    }
  }
};
