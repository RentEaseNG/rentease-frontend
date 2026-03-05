import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Home, CalendarCheck, Bell, MessageSquare,
    Plus, ArrowRight, MapPin, CheckCircle,
    Clock, XCircle, ChevronRight, Building2,
    Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

// ─── helpers ────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
    pending: { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-700', Icon: Clock },
    confirmed: { label: 'Confirmed', bg: 'bg-green-100', text: 'text-green-700', Icon: CheckCircle },
    cancelled: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-600', Icon: XCircle },
    completed: { label: 'Completed', bg: 'bg-blue-100', text: 'text-blue-700', Icon: CheckCircle },
};

const fmt = (n) =>
    typeof n === 'number' ? `₦${n.toLocaleString()}` : '—';

const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

// ─── sub-components ──────────────────────────────────────────────────────────

/** Animated stat card */
const StatCard = ({ icon: Icon, iconBg, iconColor, value, label, to, loading }) => (
    <Link
        to={to}
        className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4
               hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
            <Icon size={22} className={iconColor} />
        </div>
        <div className="min-w-0">
            {loading ? (
                <div className="h-7 w-10 bg-gray-200 rounded animate-pulse mb-1" />
            ) : (
                <p className="text-3xl font-bold text-gray-900 leading-none">{value}</p>
            )}
            <p className="text-sm text-gray-500 mt-1 truncate">{label}</p>
        </div>
        <ArrowRight
            size={16}
            className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors shrink-0"
        />
    </Link>
);

/** Skeleton row */
const SkeletonRow = () => (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 animate-pulse">
        <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-gray-200 rounded w-3/5" />
            <div className="h-3 bg-gray-100 rounded w-2/5" />
        </div>
        <div className="h-5 w-16 bg-gray-100 rounded-full" />
    </div>
);

/** Section header with "View all" link */
const SectionHeader = ({ title, to, linkLabel = 'View all' }) => (
    <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-800">{title}</h2>
        <Link
            to={to}
            className="flex items-center gap-1 text-sm text-green-700 font-medium hover:underline"
        >
            {linkLabel} <ChevronRight size={14} />
        </Link>
    </div>
);

// ─── main page ───────────────────────────────────────────────────────────────

const Dashboard = () => {
    const { user, token } = useAuth();
    const { unreadCount } = useNotification();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [loadingProps, setLoadingProps] = useState(true);

    // Fetch bookings
    useEffect(() => {
        if (!token) return;
        axios
            .get('http://localhost:5000/api/bookings/my', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => setBookings(r.data?.data ?? []))
            .catch(() => { })
            .finally(() => setLoadingBookings(false));
    }, [token]);

    // Fetch user's properties
    useEffect(() => {
        if (!user) return;
        axios
            .get('http://localhost:5000/api/properties')
            .then((r) => {
                const all = r.data?.data ?? [];
                setProperties(
                    all.filter(
                        (p) => p.landlord?._id === user._id || p.landlord === user._id
                    )
                );
            })
            .catch(() => { })
            .finally(() => setLoadingProps(false));
    }, [user]);

    // Derived
    const recentBookings = bookings.slice(0, 3);
    const recentProps = properties.slice(0, 3);

    // Today's date
    const today = new Date().toLocaleDateString('en-NG', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    // User initial
    const initial = user?.name?.charAt(0)?.toUpperCase() ?? '?';

    // Quick actions
    const quickActions = [
        { label: 'List Property', icon: Plus, to: '/new', bg: 'bg-green-600', hover: 'hover:bg-green-700' },
        { label: 'My Bookings', icon: CalendarCheck, to: '/my-bookings', bg: 'bg-blue-600', hover: 'hover:bg-blue-700' },
        { label: 'Messages', icon: MessageSquare, to: '/messages', bg: 'bg-purple-600', hover: 'hover:bg-purple-700' },
        { label: 'Notifications', icon: Bell, to: '/notifications', bg: 'bg-orange-500', hover: 'hover:bg-orange-600' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

                {/* ── Hero greeting ─────────────────────────────────────────────── */}
                <div className="relative bg-gradient-to-br from-green-800 via-green-700 to-emerald-600
                        rounded-2xl px-6 py-7 text-white overflow-hidden shadow-lg">
                    {/* decorative blobs */}
                    <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
                    <div className="absolute bottom-0 left-1/2 w-64 h-24 bg-white/5 rounded-full -translate-x-1/2" />

                    <div className="relative flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center
                            justify-center text-2xl font-bold shrink-0 border border-white/30">
                            {initial}
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl font-bold leading-tight">
                                    Welcome back, {user?.name?.split(' ')[0] ?? 'there'}!
                                </h1>
                                <span className="flex items-center gap-1 bg-white/15 text-white/90 text-xs
                                 font-medium px-2.5 py-1 rounded-full border border-white/20">
                                    <Sparkles size={11} />
                                    {user?.role ?? 'Tenant'}
                                </span>
                            </div>
                            <p className="text-white/70 text-sm mt-0.5">{today}</p>
                        </div>

                        {/* Notification bubble — top-right */}
                        <Link
                            to="/notifications"
                            className="ml-auto flex items-center gap-2 bg-white/15 hover:bg-white/25
                         transition-colors rounded-xl px-3 py-2 shrink-0 border border-white/20"
                        >
                            <Bell size={16} />
                            {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* ── Stat cards ──────────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={Home}
                        iconBg="bg-green-50"
                        iconColor="text-green-700"
                        value={properties.length}
                        label="Properties Listed"
                        to="/my-properties"
                        loading={loadingProps}
                    />
                    <StatCard
                        icon={CalendarCheck}
                        iconBg="bg-blue-50"
                        iconColor="text-blue-600"
                        value={bookings.length}
                        label="Properties Booked"
                        to="/my-bookings"
                        loading={loadingBookings}
                    />
                    <StatCard
                        icon={Bell}
                        iconBg="bg-orange-50"
                        iconColor="text-orange-500"
                        value={unreadCount}
                        label="Unread Notifications"
                        to="/notifications"
                        loading={false}
                    />
                    <StatCard
                        icon={MessageSquare}
                        iconBg="bg-purple-50"
                        iconColor="text-purple-600"
                        value="Chat"
                        label="Messages"
                        to="/messages"
                        loading={false}
                    />
                </div>

                {/* ── Main content grid ────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Recent Bookings */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <SectionHeader title="Recent Bookings" to="/my-bookings" />

                        {loadingBookings ? (
                            <>
                                <SkeletonRow /><SkeletonRow /><SkeletonRow />
                            </>
                        ) : recentBookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                                <CalendarCheck size={36} strokeWidth={1.2} />
                                <p className="text-sm font-medium">No bookings yet</p>
                                <Link to="/listings" className="text-xs text-green-700 hover:underline">
                                    Browse listings →
                                </Link>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-50">
                                {recentBookings.map((b) => {
                                    const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.pending;
                                    return (
                                        <li key={b._id} className="flex items-center gap-3 py-3">
                                            {/* Thumbnail */}
                                            {b.property?.images?.[0] ? (
                                                <img
                                                    src={b.property.images[0]}
                                                    alt={b.property.title}
                                                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center
                                        justify-center shrink-0">
                                                    <Building2 size={18} className="text-gray-300" />
                                                </div>
                                            )}

                                            {/* Info */}
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-gray-800 truncate">
                                                    {b.property?.title ?? 'Property'}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {fmtDate(b.startDate)} → {fmtDate(b.endDate)}
                                                </p>
                                            </div>

                                            {/* Status badge */}
                                            <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full
                                        ${cfg.bg} ${cfg.text}`}>
                                                {cfg.label}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    {/* My Recent Listings */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-gray-800">My Recent Listings</h2>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate('/new')}
                                    className="flex items-center gap-1 text-xs text-green-700 font-medium
                             border border-green-200 bg-green-50 hover:bg-green-100
                             px-2.5 py-1 rounded-lg transition-colors"
                                >
                                    <Plus size={12} /> Add
                                </button>
                                <Link
                                    to="/my-properties"
                                    className="flex items-center gap-1 text-sm text-green-700 font-medium hover:underline"
                                >
                                    View all <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>

                        {loadingProps ? (
                            <>
                                <SkeletonRow /><SkeletonRow /><SkeletonRow />
                            </>
                        ) : recentProps.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                                <Home size={36} strokeWidth={1.2} />
                                <p className="text-sm font-medium">No properties listed yet</p>
                                <button
                                    onClick={() => navigate('/new')}
                                    className="text-xs text-green-700 hover:underline flex items-center gap-1"
                                >
                                    <Plus size={12} /> List your first property
                                </button>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-50">
                                {recentProps.map((p) => (
                                    <li key={p._id} className="flex items-center gap-3 py-3">
                                        {/* Thumbnail */}
                                        {p.images?.[0] ? (
                                            <img
                                                src={p.images[0]}
                                                alt={p.title}
                                                className="w-12 h-12 rounded-lg object-cover shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center
                                      justify-center shrink-0">
                                                <Building2 size={18} className="text-gray-300" />
                                            </div>
                                        )}

                                        {/* Info */}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{p.title}</p>
                                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                                <MapPin size={10} /> {p.location}
                                            </p>
                                        </div>

                                        {/* Price + availability */}
                                        <div className="shrink-0 text-right">
                                            <p className="text-sm font-semibold text-gray-800">{fmt(p.price)}</p>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                                        ${p.available
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-500'}`}>
                                                {p.available ? 'Available' : 'Rented'}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* ── Quick Actions ────────────────────────────────────────────────── */}
                <div>
                    <h2 className="text-base font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {quickActions.map(({ label, icon: Icon, to, bg, hover }) => (
                            <Link
                                key={label}
                                to={to}
                                className={`${bg} ${hover} transition-colors rounded-2xl p-5 flex flex-col
                            items-center justify-center gap-3 text-white shadow-sm
                            hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
                            >
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Icon size={20} />
                                </div>
                                <span className="text-sm font-semibold">{label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;