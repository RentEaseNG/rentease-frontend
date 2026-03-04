import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AdminStats from "../components/admin/AdminStats";
import AdminUsersTab from "../components/admin/AdminUsersTab";
import AdminBookingsTab from "../components/admin/AdminBookingsTab";
import AdminPropertiesTab from "../components/admin/AdminPropertiesTab";
import { LayoutDashboard, Users, BookOpen, Home, ShieldAlert } from "lucide-react";

const TABS = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "bookings", label: "Bookings", icon: BookOpen },
    { id: "properties", label: "Properties", icon: Home },
];

const AdminPanel = () => {
    const { token, user } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/dashboard/admin-overview", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setStats(res.data.data))
            .catch(console.error)
            .finally(() => setStatsLoading(false));
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top bar */}
            <div className="bg-green-900 text-white px-6 py-5">
                <div className="max-w-7xl mx-auto flex items-center gap-3">
                    <ShieldAlert size={22} />
                    <div>
                        <h1 className="text-xl font-bold">Admin Panel</h1>
                        <p className="text-green-200 text-sm">Signed in as {user?.name || user?.email}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats */}
                {statsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 bg-white rounded-xl animate-pulse border border-gray-100" />
                        ))}
                    </div>
                ) : (
                    <div className="mb-8">
                        <AdminStats data={stats} />
                    </div>
                )}

                {/* Tab bar */}
                <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 w-fit shadow-sm">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === id
                                    ? "bg-green-900 text-white shadow"
                                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                                }`}
                        >
                            <Icon size={15} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div>
                    {activeTab === "overview" && (
                        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                            {stats?.recentActivity?.bookings?.length > 0 ? (
                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Recent Bookings</p>
                                    {stats.recentActivity.bookings.map((b) => (
                                        <div key={b._id} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                                            <span className="text-gray-700">Booking #{b._id.slice(-6)}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${b.status === "confirmed" ? "bg-green-100 text-green-700" :
                                                    b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                        b.status === "cancelled" ? "bg-red-100 text-red-700" :
                                                            "bg-blue-100 text-blue-700"
                                                }`}>{b.status}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">No recent activity yet.</p>
                            )}
                        </div>
                    )}
                    {activeTab === "users" && <AdminUsersTab />}
                    {activeTab === "bookings" && <AdminBookingsTab />}
                    {activeTab === "properties" && <AdminPropertiesTab />}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
