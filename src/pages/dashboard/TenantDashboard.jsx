import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    CalendarCheck, 
    Bell, 
    ChatCircle, 
    MagnifyingGlass,
    House, 
    Clock, 
    CheckCircle, 
    XCircle,
    CaretRight, 
    ArrowRight, 
    MapPin, 
    Sparkle,
    Receipt,
    ArrowsOut
} from '@phosphor-icons/react';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const STATUS_CONFIG = {
    pending:   { label: 'Pending',   bg: 'bg-amber-50', text: 'text-amber-600', Icon: Clock },
    confirmed: { label: 'Confirmed', bg: 'bg-emerald-50',  text: 'text-emerald-600',  Icon: CheckCircle },
    cancelled: { label: 'Cancelled', bg: 'bg-rose-50',    text: 'text-rose-600',    Icon: XCircle },
    completed: { label: 'Completed', bg: 'bg-zinc-50',   text: 'text-zinc-600',   Icon: CheckCircle },
};

const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const StatCard = ({ icon: Icon, color, value, label, to, loading }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="premium-card p-6 flex flex-col gap-4 relative overflow-hidden group"
    >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${color}`}>
            <Icon size={24} weight="fill" />
        </div>
        <div>
            {loading ? (
                <div className="h-8 w-16 bg-zinc-100 animate-pulse rounded-lg mb-1" />
            ) : (
                <p className="text-3xl font-mono font-bold text-zinc-900 tracking-tighter">{value}</p>
            )}
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{label}</p>
        </div>
        <Link to={to} className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight size={20} weight="bold" className="text-zinc-400" />
        </Link>
    </motion.div>
);

export default function TenantDashboard() {
    const { user, token } = useAuth();
    const { unreadCount } = useNotification();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        apiClient.get('/bookings/tenant')
            .then(r => setBookings(r.data?.data?.bookings ?? r.data?.data ?? []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [token]);

    const recentBookings = bookings.slice(0, 5);
    const displayName = user?.firstName || 'Guest';
    const pendingCount  = bookings.filter(b => b.status === 'pending').length;
    const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="py-12 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-[10px] font-bold uppercase tracking-widest border border-brand-100">
                                <Sparkle size={10} weight="fill" className="inline mr-1" />
                                Premium Tenant
                             </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-zinc-900 tracking-tighter">
                            Welcome, <span className="text-zinc-400">{displayName}.</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="flex flex-col items-end mr-4">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Current Date</span>
                            <span className="text-sm font-bold text-zinc-900">{new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long' })}</span>
                         </div>
                         <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white text-sm font-bold shadow-xl">
                            {user?.firstName?.charAt(0) || 'U'}
                         </div>
                    </div>
                </div>

                {/* Main Dashboard Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-12 gap-8"
                >
                    {/* Left Column - Stats & Quick Actions */}
                    <div className="md:col-span-8 flex flex-col gap-8">
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <StatCard 
                                icon={CalendarCheck} color="bg-emerald-50 text-emerald-600"
                                value={bookings.length} label="Total Bookings" to="/my-bookings" loading={loading} 
                            />
                            <StatCard 
                                icon={Clock} color="bg-amber-50 text-amber-600"
                                value={pendingCount} label="Pending Requests" to="/my-bookings" loading={loading} 
                            />
                            <StatCard 
                                icon={Receipt} color="bg-brand-50 text-brand-600"
                                value={confirmedCount} label="Active Leases" to="/my-bookings" loading={loading} 
                            />
                        </div>

                        {/* Recent Activity Table-like list */}
                        <div className="premium-card p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-display font-extrabold text-zinc-900 tracking-tight">Recent Activity</h3>
                                <Link to="/my-bookings" className="text-xs font-bold text-brand-600 uppercase tracking-widest hover:text-brand-700 transition-colors flex items-center gap-1">
                                    Full History <CaretRight size={14} weight="bold" />
                                </Link>
                            </div>

                            {loading ? (
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-16 bg-zinc-50 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            ) : recentBookings.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 mx-auto mb-4">
                                        <House size={24} weight="regular" />
                                    </div>
                                    <p className="text-zinc-500 font-medium mb-4">No recent bookings found</p>
                                    <Link to="/listings" className="btn-primary py-2 text-xs">Browse Properties</Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {recentBookings.map((b) => {
                                        const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.pending;
                                        return (
                                            <div key={b._id} className="flex items-center gap-4 group">
                                                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-zinc-100 shrink-0">
                                                    <img 
                                                        src={b.property?.images?.[0]} 
                                                        alt="" 
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-zinc-900 truncate tracking-tight">{b.property?.title}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <MapPin size={14} weight="bold" className="text-zinc-400" />
                                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{b.property?.location}</span>
                                                    </div>
                                                </div>
                                                <div className="hidden sm:flex flex-col items-end px-4">
                                                     <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Stay Period</span>
                                                     <span className="text-[11px] font-bold text-zinc-600">{fmtDate(b.startDate)}</span>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full ${cfg.bg} ${cfg.text} text-[10px] font-bold uppercase tracking-widest border border-current opacity-70`}>
                                                    {cfg.label}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Sidebar Actions & Context */}
                    <div className="md:col-span-4 flex flex-col gap-8">
                        {/* Quick Actions Bento */}
                        <div className="premium-card p-8 flex flex-col h-full bg-zinc-900 text-white">
                            <h3 className="text-xl font-display font-extrabold mb-8 tracking-tight text-white">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-4 flex-grow">
                                <Link to="/listings" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex flex-col gap-3 group">
                                    <MagnifyingGlass size={24} weight="regular" className="text-brand-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Browse</span>
                                </Link>
                                <Link to="/messages" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex flex-col gap-3 group">
                                    <ChatCircle size={24} weight="regular" className="text-emerald-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Inbox</span>
                                </Link>
                                <Link to="/my-bookings" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex flex-col gap-3 group">
                                    <CalendarCheck size={24} weight="regular" className="text-amber-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Bookings</span>
                                </Link>
                                <Link to="/notifications" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex flex-col gap-3 group">
                                    <div className="relative">
                                        <Bell size={24} weight="regular" className="text-rose-500 group-hover:scale-110 transition-transform" />
                                        {unreadCount > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-white">Alerts</span>
                                </Link>
                            </div>
                        </div>

                        {/* Upgrade/Help Card */}
                        <div className="premium-card p-8 bg-brand-600 text-white relative overflow-hidden group">
                             <div className="relative z-10">
                                <h3 className="text-lg font-display font-extrabold mb-2 tracking-tight">Need Assistance?</h3>
                                <p className="text-sm text-brand-100 mb-6 leading-relaxed">Our premium concierge service is available 24/7 for all your rental needs.</p>
                                <button className="bg-white text-brand-600 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                                    Contact Support
                                </button>
                             </div>
                             <div className="absolute bottom-[-20%] right-[-10%] opacity-20 rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-700">
                                 <ArrowsOut size={24} weight="regular" />
                             </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
