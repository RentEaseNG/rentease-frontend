import React, { useEffect, useState } from "react";
import { 
    Layout, 
    Users, 
    BookOpen, 
    House, 
    ShieldCheck, 
    Stack,
    Warning,
    Spinner
} from "@phosphor-icons/react";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import AdminStats from "../components/admin/AdminStats";
import AdminUsersTab from "../components/admin/AdminUsersTab";
import AdminBookingsTab from "../components/admin/AdminBookingsTab";
import AdminPropertiesTab from "../components/admin/AdminPropertiesTab";
import AdminApartmentTypesTab from "../components/admin/AdminApartmentTypesTab";

const TABS = [
    { id: "overview", label: "Overview", icon: Layout },
    { id: "users", label: "Users", icon: Users },
    { id: "bookings", label: "Bookings", icon: BookOpen },
    { id: "properties", label: "Properties", icon: House },
    { id: "types", label: "Apartment Types", icon: Stack },
];

const AdminPanel = () => {
    const { token, user } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        apiClient
            .get("/dashboard/admin/overview")
            .then((res) => setStats(res.data.data))
            .catch(console.error)
            .finally(() => setStatsLoading(false));
    }, [token]);

    return (
        <div className="min-h-screen bg-zinc-50/50">
            {/* Top bar */}
            <div className="bg-zinc-900 text-white px-8 py-10 shadow-2xl">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/20">
                            <ShieldCheck size={28} weight="bold" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-extrabold tracking-tighter">Admin <span className="text-zinc-500">Cockpit.</span></h1>
                            <p className="text-zinc-500 font-medium text-sm">System Authority: {user?.name || user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-8">
                {/* Stats */}
                {statsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 premium-card animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="mb-12">
                        <AdminStats data={stats} />
                    </div>
                )}

                {/* Tab bar */}
                <div className="flex flex-wrap gap-2 bg-white border border-zinc-100 rounded-2xl p-2 mb-8 w-fit shadow-xl shadow-zinc-200/50">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${activeTab === id
                                    ? "bg-zinc-900 text-white shadow-lg"
                                    : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"
                                }`}
                        >
                            <Icon size={18} weight={activeTab === id ? "bold" : "regular"} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="pb-20">
                    {activeTab === "overview" && (
                        <div className="premium-card p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center">
                                    <Layout size={20} weight="bold" />
                                </div>
                                <h2 className="text-2xl font-display font-extrabold text-zinc-900 tracking-tight">Recent System Activity</h2>
                            </div>
                            
                            {stats?.recentActivity?.bookings?.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.recentActivity.bookings.map((b) => (
                                        <div key={b._id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100 group hover:border-brand-200 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm font-mono text-[10px] font-bold">
                                                    #{b._id.slice(-4)}
                                                </div>
                                                <span className="font-bold text-zinc-900">New Booking Request</span>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${b.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                                                    b.status === "pending" ? "bg-amber-100 text-amber-700" :
                                                        b.status === "cancelled" ? "bg-rose-100 text-rose-700" :
                                                            "bg-brand-100 text-brand-700"
                                                }`}>{b.status}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-12 text-zinc-400">
                                    <Warning size={40} className="mb-4" />
                                    <p className="font-medium">No recent activity synchronized.</p>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === "users" && <AdminUsersTab />}
                    {activeTab === "bookings" && <AdminBookingsTab />}
                    {activeTab === "properties" && <AdminPropertiesTab />}
                    {activeTab === "types" && <AdminApartmentTypesTab />}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
