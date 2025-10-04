import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import axios from "axios";

const BookApartment = () => {
    const { user, token } = useAuth();
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const bookApartment = async () => {
        if (!user) {
            alert("You must be logged in to book an apartment.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            console.log(
                {
                    property: id,
                    startDate: "2025-09-10",
                    endDate: "2025-09-20",
                }
            )
            // const response = await axios.post("http://localhost:5000/api/bookings",
            //     {
            //         property: id,
            //         startDate: "2025-09-10",
            //         endDate: "2025-09-20",
            //     },
            //     {
            //         headers: {
            //             "Content-Type": "application/json",
            //             Authorization: `Bearer ${token}`, // ✅ use auth token from context
            //         },
            //     }
            // );

            // if (response.status === 201) {
            //     alert("✅ Apartment booked successfully!");
            // } else {
            //     setError("Something went wrong. Please try again.");
            // }
        } catch (err) {
            console.error("Error booking apartment:", err);
            setError("❌ Error booking apartment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={bookApartment}
                disabled={loading}
                className={`inline-block px-6 py-3 rounded-lg font-bold transition 
          ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-900 hover:bg-green-800 text-white"}`}
            >
                {loading ? "Booking..." : "Book Apartment"}
            </button>

            {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
    );
};

export default BookApartment;