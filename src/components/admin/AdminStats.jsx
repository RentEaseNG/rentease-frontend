import React from "react";
import { Users, Home, BookOpen, DollarSign, TrendingUp } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
        </div>
    </div>
);

const AdminStats = ({ data }) => {
    if (!data) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
                icon={Users}
                label="Total Users"
                value={data.users?.toLocaleString()}
                color="bg-blue-500"
            />
            <StatCard
                icon={Home}
                label="Total Properties"
                value={data.properties?.toLocaleString()}
                color="bg-green-700"
            />
            <StatCard
                icon={BookOpen}
                label="Total Bookings"
                value={data.bookings?.toLocaleString()}
                color="bg-purple-500"
            />
            <StatCard
                icon={DollarSign}
                label="Total Revenue"
                value={`₦${(data.revenue || 0).toLocaleString()}`}
                color="bg-orange-500"
            />
        </div>
    );
};

export default AdminStats;
