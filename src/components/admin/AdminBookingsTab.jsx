import React, { useEffect, useState } from "react";
import apiClient from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const STATUSES = ["pending", "confirmed", "cancelled", "completed"];

const STATUS_STYLES = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
    completed: "bg-blue-100 text-blue-700",
};

const AdminBookingsTab = () => {
    const { token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null); // booking id being updated

    useEffect(() => {
        // /api/bookings/user/bookings returns all bookings for admins
        apiClient
            .get("/bookings/user/bookings")
            .then((res) => setBookings(res.data.data?.bookings ?? res.data.data ?? []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [token]);

    const handleStatusChange = async (bookingId, newStatus) => {
        setUpdating(bookingId);
        try {
            const res = await apiClient.patch(
                `/bookings/${bookingId}/status`,
                { status: newStatus }
            );
            setBookings((prev) =>
                prev.map((b) =>
                    b._id === bookingId ? { ...b, status: res.data.data?.status ?? newStatus } : b
                )
            );
        } catch (err) {
            console.error("Status update failed:", err);
            alert(err.response?.data?.message ?? "Failed to update status.");
        } finally {
            setUpdating(null);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center py-16">
                <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
            </div>
        );

    const fmt = (d) =>
        new Date(d).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3 text-left">Tenant</th>
                        <th className="px-4 py-3 text-left">Property</th>
                        <th className="px-4 py-3 text-left">Dates</th>
                        <th className="px-4 py-3 text-left">Total</th>
                        <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {bookings.map((b) => (
                        <tr key={b._id} className="bg-white hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-800">
                                {b.tenant?.name || b.tenant?.firstName || "—"}
                                <p className="text-xs text-gray-400 font-normal">{b.tenant?.email}</p>
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                                {b.property?.title || "—"}
                                <p className="text-xs text-gray-400">{b.property?.location}</p>
                            </td>
                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                                {b.startDate ? fmt(b.startDate) : "—"} → {b.endDate ? fmt(b.endDate) : "—"}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-800">
                                ₦{b.totalPrice?.toLocaleString() ?? "—"}
                            </td>
                            <td className="px-4 py-3">
                                <select
                                    value={b.status}
                                    disabled={updating === b._id}
                                    onChange={(e) => handleStatusChange(b._id, e.target.value)}
                                    className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-green-500 ${STATUS_STYLES[b.status] ?? "bg-gray-100 text-gray-700"
                                        } ${updating === b._id ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {STATUSES.map((s) => (
                                        <option key={s} value={s}>
                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {bookings.length === 0 && (
                <p className="text-center text-gray-400 py-10">No bookings found.</p>
            )}
        </div>
    );
};

export default AdminBookingsTab;
