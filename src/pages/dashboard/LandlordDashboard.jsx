import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    House, 
    Plus, 
    CalendarCheck, 
    Bell, 
    ChatCircle, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Users, 
    CurrencyCircleDollar,
    CaretRight,
    ArrowRight,
    MapPin,
    Sparkle,
    ChartPie
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

const fmtPrice = (n) => typeof n === 'number' ? `₦${n.toLocaleString()}` : '—';
const fmtDate  = (d) => d
    ? new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

const StatCard = ({ icon: Icon, color, value, label, to, loading, sub }) => (
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
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest leading-tight">{label}</p>
            {sub && <p className="text-[10px] font-bold text-zinc-300 uppercase mt-0.5">{sub}</p>}
        </div>
        <Link to={to} className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight size={20} weight="bold" className="text-zinc-400" />
        </Link>
    </motion.div>
);

export default function LandlordDashboard() {
    const { user, token } = useAuth();
    const { unreadCount } = useNotification();
    const navigate = useNavigate();

    const [properties, setProperties] = useState([]);
    const [incomingBookings, setIncomingBookings] = useState([]);
    const [loadingProps, setLoadingProps] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(true);

    useEffect(() => {
        if (!token || !user?._id) { setLoadingProps(false); return; }
        apiClient.get(`/users/${user._id}/properties`)
            .then(r => setProperties(r.data?.data?.properties ?? r.data?.data ?? []))
            .catch(() => {})
            .finally(() => setLoadingProps(false));
    }, [token, user?._id]);

    useEffect(() => {
        if (!token) return;
        apiClient.get('/bookings/landlord')
            .then(r => setIncomingBookings(r.data?.data?.bookings ?? r.data?.data ?? []))
            .catch(() => {})
            .finally(() => setLoadingBookings(false));
    }, [token]);

    const availableProps = properties.filter(p => p.available).length;
    const pendingBookings = incomingBookings.filter(b => b.status === 'pending').length;
    const recentProps = properties.slice(0, 4);
    const recentBookings = incomingBookings.slice(0, 4);

    const displayName = user?.firstName || 'Landlord';

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <div className="py-12 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <span className="px-3 py-1 rounded-full bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest border border-zinc-800">
                                <Sparkle size={10} weight="fill" className="inline mr-1 text-brand-500" />
                                Estate Manager
                             </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-zinc-900 tracking-tighter">
                            Control <span className="text-zinc-400">Center.</span>
                        </h1>
                        <p className="text-zinc-500 font-medium mt-2">Managing {properties.length} properties across Nigeria.</p>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-12 gap-8"
                >
                    {/* Stats Row */}
                    <div className="md:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard 
                            icon={House} color="bg-zinc-900 text-white"
                            value={properties.length} label="Total Listings" 
                            sub={`${availableProps} available`} to="/my-properties" loading={loadingProps} 
                        />
                        <StatCard 
                            icon={CalendarCheck} color="bg-brand-50 text-brand-600"
                            value={incomingBookings.length} label="Total Bookings" 
                            sub={`${pendingBookings} pending`} to="/my-properties" loading={loadingBookings} 
                        />
                        <StatCard 
                            icon={Users} color="bg-emerald-50 text-emerald-600"
                            value={pendingBookings} label="Awaiting Approval" to="/my-properties" loading={loadingBookings} 
                        />
                        <StatCard 
                            icon={Bell} color="bg-rose-50 text-rose-600"
                            value={unreadCount} label="Notifications" to="/notifications" loading={false} 
                        />
                    </div>

                    {/* Listings Table */}
                    <div className="md:col-span-6 flex flex-col gap-6">
                        <div className="premium-card p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-display font-extrabold text-zinc-900 tracking-tight">Active Listings</h3>
                                <Link to="/my-properties" className="text-xs font-bold text-zinc-400 uppercase tracking-widest hover:text-brand-600 transition-colors flex items-center gap-1">
                                    Manage All <CaretRight size={14} weight="bold" />
                                </Link>
                            </div>

                            <div className="space-y-6">
                                {loadingProps ? (
                                    <div className="h-40 bg-zinc-50 rounded-2xl animate-pulse" />
                                ) : recentProps.length === 0 ? (
                                    <div className="py-8 text-center text-zinc-400 text-sm font-medium">No properties listed.</div>
                                ) : (
                                    recentProps.map(p => (
                                        <div key={p._id} className="flex items-center gap-4 group">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-zinc-100 shrink-0">
                                                <img src={p.images?.[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-zinc-900 truncate tracking-tight">{p.title}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <MapPin size={14} weight="bold" className="text-zinc-400" />
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{p.location}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-mono font-bold text-zinc-900 leading-none">{fmtPrice(p.price)}</p>
                                                <span className={`text-[9px] font-bold uppercase tracking-widest ${p.available ? 'text-emerald-600' : 'text-zinc-400'}`}>
                                                    {p.available ? 'Available' : 'Rented'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <div className="md:col-span-6 flex flex-col gap-6">
                         <div className="premium-card p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-display font-extrabold text-zinc-900 tracking-tight">Recent Bookings</h3>
                                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest">
                                    {pendingBookings} New
                                </span>
                            </div>

                            <div className="space-y-6">
                                {loadingBookings ? (
                                    <div className="h-40 bg-zinc-50 rounded-2xl animate-pulse" />
                                ) : recentBookings.length === 0 ? (
                                    <div className="py-8 text-center text-zinc-400 text-sm font-medium">No bookings yet.</div>
                                ) : (
                                    recentBookings.map(b => {
                                        const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.pending;
                                        const tenantName = b.tenant?.firstName || 'Tenant';
                                        return (
                                            <div key={b._id} className="flex items-center gap-4 group">
                                                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold text-xs shrink-0 border border-zinc-200">
                                                    {tenantName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-zinc-900 truncate tracking-tight">{tenantName}</h4>
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter truncate">{b.property?.title}</p>
                                                    <p className="text-[10px] font-bold text-zinc-300 uppercase mt-0.5">{fmtDate(b.startDate)} → {fmtDate(b.endDate)}</p>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full ${cfg.bg} ${cfg.text} text-[9px] font-bold uppercase tracking-widest border border-current`}>
                                                    {cfg.label}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Bento Bottom */}
                    <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                         {[
                            { label: 'Profile', icon: Users, to: '/profile', bg: 'bg-zinc-900', text: 'text-white' },
                            { label: 'Messages', icon: ChatCircle, to: '/messages', bg: 'bg-white', text: 'text-zinc-900' },
                            { label: 'Properties', icon: House, to: '/my-properties', bg: 'bg-white', text: 'text-zinc-900' },
                            { label: 'Analytics', icon: ChartPie, to: '#', bg: 'bg-white', text: 'text-zinc-900' },
                         ].map((action, i) => (
                            <Link 
                                key={i} 
                                to={action.to}
                                className={`premium-card p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 ${action.bg} ${action.text}`}
                            >
                                <action.icon size={24} weight="regular" className={action.bg === 'bg-white' ? 'text-brand-600' : 'text-brand-500'} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{action.label}</span>
                            </Link>
                         ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
