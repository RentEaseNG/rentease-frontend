import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell, CheckCheck, Trash2, BellOff,
    Info, AlertTriangle, AlertCircle, CheckCircle,
    CalendarCheck, CreditCard, Settings, ChevronDown
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const TYPE_CONFIG = {
    booking: { icon: CalendarCheck, color: 'text-green-600', bg: 'bg-green-50', label: 'Booking' },
    payment: { icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Payment' },
    success: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Success' },
    warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Warning' },
    error: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Error' },
    system: { icon: Settings, color: 'text-gray-600', bg: 'bg-gray-50', label: 'System' },
    info: { icon: Info, color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'Info' },
};

const FILTERS = ['all', 'unread', 'booking', 'payment', 'system', 'info', 'success', 'warning', 'error'];

function timeAgo(date) {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}

const Notifications = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const { markAsRead, markAllAsRead, deleteNotification, clearAll, unreadCount } = useNotification();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const buildQuery = (p = 1, f = filter) => {
        const params = new URLSearchParams({ page: p, limit: 15 });
        if (f === 'unread') params.set('read', 'false');
        else if (f !== 'all') params.set('type', f);
        return params.toString();
    };

    const fetchItems = async (p = 1, f = filter, reset = false) => {
        if (!token) return;
        if (p === 1) setLoading(true); else setLoadingMore(true);
        try {
            const res = await axios.get(
                `http://localhost:5000/api/notifications?${buildQuery(p, f)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const fetched = res.data.data?.notifications ?? [];
            setItems(prev => reset || p === 1 ? fetched : [...prev, ...fetched]);
            setHasMore(res.data.data?.pagination?.hasNext ?? false);
            setPage(p);
        } catch { /* silent */ }
        finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => { fetchItems(1, filter, true); }, [filter, token]);

    const handleMarkRead = async (id) => {
        await markAsRead(id);
        setItems(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    };

    const handleMarkAll = async () => {
        await markAllAsRead();
        setItems(prev => prev.map(n => ({ ...n, read: true })));
    };

    const handleDelete = async (id) => {
        await deleteNotification(id);
        setItems(prev => prev.filter(n => n._id !== id));
    };

    const handleClearAll = async () => {
        await clearAll();
        setItems([]);
    };

    const handleClick = async (item) => {
        if (!item.read) await handleMarkRead(item._id);
        if (item.link) navigate(item.link);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <Bell className="text-green-700" size={28} />
                            Notifications
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAll}
                                className="flex items-center gap-1.5 text-sm text-green-700 font-medium border border-green-200 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <CheckCheck size={15} /> Mark all read
                            </button>
                        )}
                        {items.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="flex items-center gap-1.5 text-sm text-red-600 font-medium border border-red-100 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Trash2 size={15} /> Clear all
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap mb-6">
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3.5 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === f
                                    ? 'bg-green-800 text-white'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-green-500 hover:text-green-700'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Loading skeletons */}
                {loading && (
                    <div className="space-y-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-100 h-20 animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && items.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                            <BellOff size={36} strokeWidth={1.2} />
                        </div>
                        <p className="text-lg font-medium text-gray-600">No notifications yet</p>
                        <p className="text-sm">
                            {filter !== 'all' ? (
                                <button onClick={() => setFilter('all')} className="text-green-700 hover:underline">
                                    Clear filter
                                </button>
                            ) : "You're all caught up!"}
                        </p>
                    </div>
                )}

                {/* Notification list */}
                {!loading && items.length > 0 && (
                    <div className="space-y-2">
                        {items.map(item => {
                            const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.info;
                            const Icon = cfg.icon;
                            return (
                                <div
                                    key={item._id}
                                    onClick={() => handleClick(item)}
                                    className={`relative group flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${!item.read
                                            ? 'bg-white border-green-100 shadow-sm hover:shadow-md'
                                            : 'bg-white border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    {/* Type icon */}
                                    <div className={`shrink-0 w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center`}>
                                        <Icon size={17} className={cfg.color} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`text-sm font-semibold leading-snug ${!item.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                                {item.title}
                                            </p>
                                            <span className="shrink-0 text-xs text-gray-400 mt-0.5">{timeAgo(item.createdAt)}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{item.message}</p>
                                        {item.link && (
                                            <p className="text-xs text-green-700 mt-1 font-medium">Tap to view →</p>
                                        )}
                                    </div>

                                    {/* Unread dot */}
                                    {!item.read && (
                                        <span className="absolute top-4 right-10 w-2 h-2 rounded-full bg-green-600" />
                                    )}

                                    {/* Delete button */}
                                    <button
                                        onClick={e => { e.stopPropagation(); handleDelete(item._id); }}
                                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-500 rounded"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            );
                        })}

                        {/* Load more */}
                        {hasMore && (
                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={() => fetchItems(page + 1, filter)}
                                    disabled={loadingMore}
                                    className="flex items-center gap-2 text-sm text-green-700 font-medium border border-green-200 bg-white hover:bg-green-50 px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {loadingMore ? 'Loading…' : <><ChevronDown size={15} /> Load more</>}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
