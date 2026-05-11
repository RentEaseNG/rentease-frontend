import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import apiClient from '../api/client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { token, user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const pollingRef = useRef(null);

    // Fetch unread count only (lightweight — used for polling)
    const fetchUnreadCount = useCallback(async () => {
        if (!token) return;
        try {
            const res = await apiClient.get('/notifications/unread-count');
            setUnreadCount(res.data.data?.unreadCount ?? 0);
        } catch {
            // silently fail
        }
    }, [token]);

    // Fetch notification list (used when panel / page opens)
    const fetchNotifications = useCallback(async (reset = false) => {
        if (!token) return;
        setLoading(true);
        const targetPage = reset ? 1 : page;
        try {
            const res = await apiClient.get(`/notifications?page=${targetPage}&limit=10`);
            const { notifications: fetched, pagination, summary } = res.data.data;
            setNotifications(prev => reset ? fetched : [...prev, ...fetched]);
            setUnreadCount(summary?.unreadCount ?? 0);
            setHasMore(pagination?.hasNext ?? false);
            if (!reset) setPage(p => p + 1);
            else setPage(2);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    }, [token, page]);

    // Mark a single notification as read
    const markAsRead = useCallback(async (id) => {
        if (!token) return;
        try {
            await apiClient.put(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch {
            // silently fail
        }
    }, [token]);

    // Mark all as read
    const markAllAsRead = useCallback(async () => {
        if (!token) return;
        try {
            await apiClient.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch {
            // silently fail
        }
    }, [token]);

    // Delete a single notification
    const deleteNotification = useCallback(async (id) => {
        if (!token) return;
        try {
            const deleted = notifications.find(n => n._id === id);
            await apiClient.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id));
            if (deleted && !deleted.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch {
            // silently fail
        }
    }, [token, notifications]);

    // Clear all notifications
    const clearAll = useCallback(async () => {
        if (!token) return;
        try {
            await apiClient.delete('/notifications/clear-all');
            setNotifications([]);
            setUnreadCount(0);
        } catch {
            // silently fail
        }
    }, [token]);

    // Start polling when user is logged in
    useEffect(() => {
        if (user && token) {
            fetchUnreadCount(); // initial fetch
            pollingRef.current = setInterval(fetchUnreadCount, 30_000);
        }
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [user, token, fetchUnreadCount]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            hasMore,
            fetchNotifications,
            fetchUnreadCount,
            markAsRead,
            markAllAsRead,
            deleteNotification,
            clearAll,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;
