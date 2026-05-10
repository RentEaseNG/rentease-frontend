import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/client";
import { CalendarCheck, AlertCircle } from "lucide-react";

const BookApartment = ({ propertyId }) => {
    const { user } = useAuth();

    const today = new Date().toISOString().split("T")[0];
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [specialRequests, setSpecialRequests] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleBook = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!user) {
            setError("You must be logged in to book an apartment.");
            return;
        }
        if (!startDate || !endDate) {
            setError("Please select both start and end dates.");
            return;
        }
        if (new Date(endDate) <= new Date(startDate)) {
            setError("End date must be after start date.");
            return;
        }

        setLoading(true);
        try {
            await apiClient.post("/bookings", {
                propertyId,
                startDate,
                endDate,
                specialRequests: specialRequests.trim() || undefined,
            });
            setSuccess("✅ Booking request submitted! The landlord will confirm shortly.");
            setStartDate("");
            setEndDate("");
            setSpecialRequests("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to submit booking. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4 border border-gray-200 rounded-xl p-4 bg-gray-50">
            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-3">
                <CalendarCheck size={17} className="text-green-700" />
                Book This Property
            </h3>

            {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm mb-3">
                    <AlertCircle size={14} /> {error}
                </div>
            )}
            {success && (
                <div className="text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm mb-3">
                    {success}
                </div>
            )}

            <form onSubmit={handleBook} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Move-in Date
                        </label>
                        <input
                            type="date"
                            min={today}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Move-out Date
                        </label>
                        <input
                            type="date"
                            min={startDate || today}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        Special Requests <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        rows={2}
                        maxLength={500}
                        placeholder="e.g. early check-in, parking needs…"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                    {loading ? "Submitting…" : "Request Booking"}
                </button>
            </form>
        </div>
    );
};

export default BookApartment;