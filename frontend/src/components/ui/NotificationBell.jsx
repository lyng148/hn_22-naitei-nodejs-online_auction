import React, { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useNotification } from "@/contexts/NotificationContext.jsx";
import { useNavigate } from "react-router-dom";

const formatTime = (d) => {
  try { return new Date(d).toLocaleString(); } catch { return ""; }
};

const getTargetPath = (notification) => {
  let meta = {};
  try {
    meta = notification?.metadata ? JSON.parse(notification.metadata) : {};
  } catch (e) {
    console.error('Failed to parse notification metadata:', e, notification.metadata);
    meta = {};
  }

  console.log('Notification metadata:', meta, 'notification:', notification);

  switch (meta.type) {
    case "OUTBID":
    case "AUCTION_ENDED":
    case "AUCTION_CLOSED":
    case "AUCTION_PENDING":
    case "AUCTION_CANCELED":
    case "AUCTION_READY":
    case "AUCTION_OPEN":
      if (meta.role === "SELLER") {
        return "/seller-hub/listings/auction";
      }
      if (meta.auctionId) {
        return `/auctions/${meta.auctionId}`;
      }
      return "/auctions/";
    case "COMMENT_REPORT":
      console.log('Comment report navigation:', {
        auctionId: meta.auctionId,
        commentId: meta.commentId,
        willNavigateTo: meta.auctionId && meta.commentId
          ? `/auctions/${meta.auctionId}?highlightComment=${meta.commentId}`
          : "/admin-hub/reports"
      });
      if (meta.auctionId && meta.commentId) {
        return `/auctions/${meta.auctionId}?highlightComment=${meta.commentId}`;
      }
      return "/admin-hub/reports";
    case "FOLLOW_CREATED":
    case "WARNING_CREATED":
    case "BAND":
      return "/profile";
    default:
      return "/dashboard";
  }
};

const NotificationBell = ({ isHomePage = false }) => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, reloadNotifications } = useNotification();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggle = async () => {
    if (!open) await reloadNotifications();
    setOpen(o => !o);
  };

  const handleClickNotification = async (n) => {
    const path = getTargetPath(n);
    if (!n.read) {
      try {
        await markAsRead(n.id);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="relative">
      <button aria-label="Notifications" onClick={handleToggle} className="relative">
        <IoNotificationsOutline size={22} className={`${!isHomePage ? "text-black" : "text-white"}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="font-medium">Thông báo</span>
            <button
              className="text-sm text-green hover:underline disabled:opacity-50"
              onClick={markAllAsRead}
              disabled={unreadCount === 0 || loading}
            >
              {loading ? "Đang tải..." : "Đánh dấu tất cả đã đọc"}
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && <div className="px-4 py-6 text-sm text-gray-500">Đang tải thông báo...</div>}
            {!loading && notifications.length === 0 && <div className="px-4 py-6 text-sm text-gray-500">Không có thông báo</div>}
            {!loading && notifications.map(n => (
              <div
                key={n.id}
                className={`px-4 py-3 text-sm cursor-pointer ${n.read ? "bg-white" : "bg-gray-50"}`}
                onClick={() => handleClickNotification(n)}
              >
                <div className="flex items-start gap-2">
                  <div className={`mt-1 h-2 w-2 rounded-full ${n.read ? "bg-transparent" : "bg-green"}`}></div>
                  <div className="flex-1">
                    <div className="text-gray-800">{n.message}</div>
                    <div className="text-xs text-gray-400 mt-1">{formatTime(n.createdAt)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
