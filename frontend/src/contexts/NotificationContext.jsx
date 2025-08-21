import { Toast } from '@/components/ui/index.js';
import notificationWS from '@/services/notification-websocket.service.js';
import notificationService from '@/services/notification.service.js';
import { clearTokens, clearUser, getAccessToken } from '@/utils/token-storage.js';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import toast from "react-hot-toast";

const NotificationContext = createContext(null);

const CACHE_KEYS = { LIST: 'notif:list', UNREAD: 'notif:unread' };
const MAX_CACHE = 100;

const dedupeSort = (list) => {
  const map = new Map();
  list.forEach(n => map.set(n.id, n));
  return Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const readCache = () => {
  try {
    const listStr = localStorage.getItem(CACHE_KEYS.LIST);
    const unreadStr = localStorage.getItem(CACHE_KEYS.UNREAD);
    const list = listStr ? JSON.parse(listStr) : [];
    const unread = unreadStr ? Number(unreadStr) : null;
    return { list: Array.isArray(list) ? list : [], unread: Number.isFinite(unread) ? unread : null };
  } catch (error) {
    showToastNotification?.(
      error.message || 'Read Cache Error!',
      'error'
    );
  }
};

const writeCache = (list, unread) => {
  try {
    const sliced = (list || []).slice(0, MAX_CACHE);
    localStorage.setItem(CACHE_KEYS.LIST, JSON.stringify(sliced));
    if (typeof unread === 'number' && Number.isFinite(unread)) {
      localStorage.setItem(CACHE_KEYS.UNREAD, String(unread));
    }
  } catch (error) {
    showToastNotification?.(
      error.message || 'Write Cache Error!',
      'error'
    );
  }
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const offsetRef = useRef(0);
  const limitRef = useRef(10);

  const showToastNotification = useCallback((message, type = "info") => {
    toast(<Toast message={message} type={type} />, {
      duration: 3000,
      position: "top-right",
    });
  }, []);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications({
        limit: limitRef.current,
        offset: offsetRef.current,
      });
      const fetched = res?.notifications || [];
      setNotifications(prev => {
        const next = dedupeSort([...fetched, ...prev]);
        writeCache(next, undefined);
        return next;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    try {
      const nextOffset = offsetRef.current + 1;
      const res = await notificationService.getNotifications({
        limit: limitRef.current,
        offset: nextOffset,
      });
      const more = res?.notifications || [];
      setNotifications(prev => {
        const next = dedupeSort([...prev, ...more]);
        writeCache(next, undefined);
        return next;
      });
      offsetRef.current = nextOffset;
    } catch (error) {
      showToastNotification?.(
        error.message || 'Load More Notification Error!',
        'error'
      );
    }
  }, []);

  const reloadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const first = await notificationService.getNotifications({ limit: 1, offset: 0 });
      const total = first?.count || 0;
      const lim = total > 0 ? total : limitRef.current;
      const res = await notificationService.getNotifications({ limit: lim, offset: 0 });
      const list = res?.notifications || [];
      setNotifications(() => {
        const next = dedupeSort(list);
        writeCache(next, undefined);
        return next;
      });
      offsetRef.current = 0;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUnread = useCallback(async () => {
    try {
      const res = await notificationService.getUnread();
      const list = res?.notifications || [];
      const count = res?.count || list.filter(n => !n.read).length || 0;
      setUnreadCount(count);
      localStorage.setItem(CACHE_KEYS.UNREAD, String(count));
    } catch (error) {
      showToastNotification?.(
        error.message || 'UnRead Notification Error!',
        'error'
      );
    }
  }, []);

  const handleNewNotification = useCallback((data) => {
    setNotifications(prev => {
      const next = dedupeSort([data, ...prev]);
      writeCache(next, unreadCount + 1);
      return next;
    });
    setUnreadCount(c => {
      const next = c + 1;
      localStorage.setItem(CACHE_KEYS.UNREAD, String(next));
      return next;
    });
    if (data?.message) showToastNotification(data.message, "info");
  }, [unreadCount, showToastNotification]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => {
        const next = prev.map(n => n.id === notificationId ? { ...n, read: true } : n);
        writeCache(next, Math.max(0, unreadCount - 1));
        return next;
      });
      setUnreadCount(c => {
        const next = Math.max(0, c - 1);
        localStorage.setItem(CACHE_KEYS.UNREAD, String(next));
        return next;
      });
      notificationWS.markAsReadWS(notificationId);
    } catch {
      showToastNotification("Mark As Read Notification Error!", "error");
    }
  }, [showToastNotification, unreadCount]);

  const markAllAsRead = useCallback(async () => {
    try {
      notificationWS.markAllAsReadWS();
      setNotifications(prev => {
        const next = prev.map(n => ({ ...n, read: true }));
        writeCache(next, 0);
        return next;
      });
      setUnreadCount(0);
      localStorage.setItem(CACHE_KEYS.UNREAD, '0');
    } catch {
      showToastNotification("Mark As Read Notification Error!", "error");
    }
  }, [showToastNotification]);

  useEffect(() => {
    const { list, unread } = readCache();
    if (list.length) setNotifications(prev => dedupeSort([...list, ...prev]));
    if (unread !== null) setUnreadCount(unread);
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    const onConnected = () => setConnected(true);
    const onDisconnected = () => setConnected(false);
    // const handleNewNotification = useCallback((data) => {
    //   setNotifications(prev => {
    //     const next = dedupeSort([data, ...prev]);
    //     writeCache(next, unreadCount + 1);
    //     return next;
    //   });
    //   setUnreadCount(c => {
    //     const next = c + 1;
    //     localStorage.setItem(CACHE_KEYS.UNREAD, String(next));
    //     return next;
    //   });
    //   if (data?.message) showToastNotification(data.message, "info");
    // }, [unreadCount, showToastNotification]);
    const onWsError = (e) => {
      const msg = typeof e === 'string' ? e : (e?.message || 'WebSocket error');
      showToastNotification(`Notification WS: ${msg}`, "error");
    };

    notificationWS.on("connected", onConnected);
    notificationWS.on("disconnected", onDisconnected);
    notificationWS.on("new_notification", handleNewNotification);
    notificationWS.on("notification_error", onWsError);
    notificationWS.on("connect_error", onWsError);
    notificationWS.on("error", onWsError);

    const s = notificationWS.connect();

    return () => {
      notificationWS.off("connected", onConnected);
      notificationWS.off("disconnected", onDisconnected);
      notificationWS.off("new_notification", handleNewNotification);
      notificationWS.off("notification_error", onWsError);
      notificationWS.off("connect_error", onWsError);
      notificationWS.off("error", onWsError);
      s?.disconnect?.();
    };
  }, [showToastNotification]);

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    loading,
    connected,
    loadMore,
    reloadNotifications, // NEW
    markAsRead,
    markAllAsRead,
    showToastNotification,
  }), [notifications, unreadCount, loading, connected, loadMore, reloadNotifications, markAsRead, markAllAsRead, showToastNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
