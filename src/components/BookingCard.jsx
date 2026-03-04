import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, DollarSign } from "lucide-react";

const STATUS_STYLES = {
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    confirmed: "bg-green-100 text-green-800 border border-green-300",
    cancelled: "bg-red-100 text-red-800 border border-red-300",
    completed: "bg-blue-100 text-blue-800 border border-blue-300",
};

const BookingCard = ({ booking }) => {
    const { property, startDate, endDate, totalPrice, status } = booking;

    const fmt = (d) =>
        new Date(d).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Property image */}
            {property?.images?.[0] && (
                <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-40 object-cover"
                />
            )}

            <div className="p-4 space-y-3">
                {/* Title + status */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-base leading-tight">
                        {property?.title || "—"}
                    </h3>
                    <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700"
                            }`}
                    >
                        {status}
                    </span>
                </div>

                {/* Location */}
                {property?.location && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin size={14} />
                        <span>{property.location}</span>
                    </div>
                )}

                {/* Dates */}
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Calendar size={14} className="text-green-700 shrink-0" />
                    <span>
                        {fmt(startDate)} → {fmt(endDate)}
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                    <DollarSign size={14} className="text-green-700" />
                    <span>₦{totalPrice?.toLocaleString()}</span>
                </div>

                {/* CTA */}
                {property?._id && (
                    <Link
                        to={`/house/${property._id}`}
                        className="inline-block mt-1 text-xs text-green-700 font-semibold hover:underline"
                    >
                        View Property →
                    </Link>
                )}
            </div>
        </div>
    );
};

export default BookingCard;
