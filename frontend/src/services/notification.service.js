import axiosClient from "@/utils/axios.js";

const NOTIFICATION_API = {
  GET_NOTIFICATIONS: "api/notifications",
  GET_UNREAD: "api/notifications/unread",
  MARK_AS_READ: "api/notifications/:notificationId/read",
  MARK_ALL_AS_READ: "api/notifications/read-all",
};

class NotificationService {
  async getNotifications(searchParams = {}) {
    try {
      const response = await axiosClient.get(NOTIFICATION_API.GET_NOTIFICATIONS,
        { params: searchParams });
      return response.data;
    } catch (err) {
      const statusCode = err?.status;
      const { message, code } = err?.response?.data || {};
      return Promise.reject({
        statusCode: statusCode || 500,
        message: message || 'Failed to fetch notifications',
        errorCode: code || 'INTERNAL_SERVER_ERROR',
      });
    }
  }


  async getUnread() {
    try {
      const response = await axiosClient.get(NOTIFICATION_API.GET_UNREAD);
      return response.data;
    } catch (err) {
      const statusCode = err?.status;
      const { message, code } = err?.response?.data || {};
      return Promise.reject({
        statusCode: statusCode || 500,
        message: message || 'Failed to fetch unread notifications',
        errorCode: code || 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async markAsRead(notificationId) {
    try {
      const response = await axiosClient.put(NOTIFICATION_API.MARK_AS_READ.replace(":notificationId", notificationId));
      return response.data;
    } catch (err) {
      const statusCode = err?.status;
      const { message, code } = err?.response?.data || {};
      return Promise.reject({
        statusCode: statusCode || 500,
        message: message || 'Failed to mark notification as read',
        errorCode: code || 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async markAllAsRead() {
    try {
      const response = await axiosClient.put(NOTIFICATION_API.MARK_ALL_AS_READ);
      return response.data;
    } catch (err) {
      const statusCode = err?.status;
      const { message, code } = err?.response?.data || {};
      return Promise.reject({
        statusCode: statusCode || 500,
        message: message || 'Failed to mark all notifications as read',
        errorCode: code || 'INTERNAL_SERVER_ERROR',
      });
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
