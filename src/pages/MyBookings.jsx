import React, { useEffect, useState } from "react";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import BookingCard from "../components/BookingCard";
import { CalendarX } from "lucide-react";

const FILTERS = ["all", "pending", "confirmed", "cancelled", "completed"];

const MyBookings = () => {
    const { token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await apiClient.get("/bookings/my");
                setBookings(res.data.data || []);
            } catch (err) {
                setError("Failed to load bookings. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [token]);

    const filtered =
        activeFilter === "all"
            ? bookings
            : bookings.filter((b) => b.status === activeFilter);

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                    <p className="text-gray-500 mt-1">
                        Track and manage all your property bookings
                    </p>
                </div>

                {/* Filter pills */}
                <div className="flex gap-2 flex-wrap mb-6">
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${activeFilter === f
                                    ? "bg-green-800 text-white"
                                    : "bg-white text-gray-600 border border-gray-200 hover:border-green-600 hover:text-green-700"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* States */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl border border-gray-100 h-64 animate-pulse"
                            />
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <p className="text-red-600 text-center">{error}</p>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
                        <CalendarX size={48} strokeWidth={1.5} />
                        <p className="text-lg font-medium">No bookings found</p>
                        {activeFilter !== "all" && (
                            <button
                                onClick={() => setActiveFilter("all")}
                                className="text-sm text-green-700 hover:underline"
                            >
                                Clear filter
                            </button>
                        )}
                    </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((b) => (
                            <BookingCard key={b._id} booking={b} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
