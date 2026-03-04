import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Bell, CheckCheck, Trash2, BellOff, ExternalLink,
    Info, AlertTriangle, AlertCircle, CheckCircle,
    CalendarCheck, CreditCard, Settings,
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const TYPE_CONFIG = {
    booking: { icon: CalendarCheck, color: 'text-green-600', bg: 'bg-green-50' },
    payment: { icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
    success: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    error: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
    system: { icon: Settings, color: 'text-gray-600', bg: 'bg-gray-50' },
    info: { icon: Info, color: 'text-indigo-600', bg: 'bg-indigo-50' },
};

function timeAgo(date) {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}

const NotificationPanel = ({ onClose }) => {
    const navigate = useNavigate();
    const panelRef = useRef(null);
    const {
        notifications, loading, unreadCount,
        fetchNotifications, markAsRead, markAllAsRead, deleteNotification, clearAll,
    } = useNotification();
    const [fetched, setFetched] = useState(false);

    // Fetch on first open
    useEffect(() => {
        if (!fetched) {
            fetchNotifications(true);
            setFetched(true);
        }
    }, [fetched, fetchNotifications]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    const handleClick = async (item) => {
        if (!item.read) await markAsRead(item._id);
        if (item.link) {
            onClose();
            navigate(item.link);
        }
    };

    // Show only the 10 most recent in the dropdown
    const displayed = notifications.slice(0, 10);

    return (
        <div
            ref={panelRef}
            className="absolute right-0 top-full mt-2 w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.14)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <Bell size={16} className="text-green-700" />
                    <span className="font-semibold text-gray-800 text-sm">Notifications</span>
                    {unreadCount > 0 && (
                        <span className="bg-green-700 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-green-700 font-medium hover:underline flex items-center gap-1"
                        >
                            <CheckCheck size={12} /> Mark all read
                        </button>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
                {loading && (
                    <div className="space-y-3 p-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex gap-3 animate-pulse">
                                <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                                    <div className="h-3 bg-gray-100 rounded w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && displayed.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
                        <BellOff size={32} strokeWidth={1.2} />
                        <p className="text-sm font-medium text-gray-500">You're all caught up!</p>
                    </div>
                )}

                {!loading && displayed.map(item => {
                    const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.info;
                    const Icon = cfg.icon;
                    return (
                        <div
                            key={item._id}
                            onClick={() => handleClick(item)}
                            className={`group relative flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${!item.read ? 'bg-green-50/40' : ''
                                }`}
                        >
                            {/* Icon */}
                            <div className={`shrink-0 w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center`}>
                                <Icon size={15} className={cfg.color} />
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0 pr-5">
                                <p className={`text-xs font-semibold leading-snug ${!item.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {item.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.message}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{timeAgo(item.createdAt)}</p>
                            </div>

                            {/* Unread dot */}
                            {!item.read && (
                                <span className="absolute top-3.5 right-7 w-1.5 h-1.5 rounded-full bg-green-600" />
                            )}

                            {/* Delete */}
                            <button
                                onClick={e => { e.stopPropagation(); deleteNotification(item._id); }}
                                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500 p-0.5"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                <Link
                    to="/notifications"
                    onClick={onClose}
                    className="text-xs text-green-700 font-semibold hover:underline flex items-center gap-1"
                >
                    See all <ExternalLink size={11} />
                </Link>
                {displayed.length > 0 && (
                    <button
                        onClick={() => { clearAll(); }}
                        className="text-xs text-red-500 hover:text-red-700 hover:underline"
                    >
                        Clear all
                    </button>
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;
