import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import houses from "../data/houses.json";
import axios from "axios";
import PropertyReview from "../components/PropertyReview";

function HouseDetails() {
  const [house, setHouse] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  const { id } = useParams();
  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
        const res = response.data.data
        setHouse(res)
      } catch (error) {
        console.error("Error fetching house details:", error);
      }
    };
    fetchHouseDetails();
  }, [id]);
  
  useEffect(() => {
    if (currentIndex === null) return; // lightbox closed → skip

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        setCurrentIndex(null); // close lightbox
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]); // re-run only when modal opens/closes

  // 🚨 Prevent redirect until auth check is done
  if (loading) {
    return (
      <div className="p-6">
        <p>Checking authentication...</p>
      </div>
    );
  }
  // 🔒 Block guests
  if (!user) {
   return <Navigate to="/login" replace />;
  }

  if (!house) {
    return (
      <div className="p-6">
        <p>House not found.</p>
        <Link to="/" className="text-green-900 underline p-2 rounded-lg">
          Back to listings
        </Link>
      </div>
    );
  }

  // all images (main + extras)
  const allImages = house.images || [];

  // navigation
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link to="/dashboard" className="text-blue-600 underline">
        ← Back to listings
      </Link>

      <div className="md:flex gap-6 mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="md:w-1/2">
          {/* Main Image */}
          <div className="mb-4">
            <img
              src={allImages[0]}
              alt={`${house.title} main`}
              onClick={() => setCurrentIndex(0)}
              className="w-full h-80 object-cover rounded-lg cursor-pointer hover:opacity-90"
            />
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] md:grid-cols-4 gap-4">
            {allImages.slice(1).map((img, index) => (
              <img
                key={index + 1}
                src={img}
                alt={`${house.title} ${index + 1}`}
                onClick={() => setCurrentIndex(index + 1)}
                className="h-32 w-32 object-cover rounded-md cursor-pointer hover:opacity-90"
              />
            ))}
          </div>
        </div>

        {/* Image Modal */}
        {currentIndex !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <button
              onClick={() => setCurrentIndex(null)}
              className="absolute top-5 right-5 text-white text-3xl font-bold cursor-pointer"
            >
              ✕
            </button>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-5 text-white text-4xl font-bold px-3 py-1 bg-black bg-opacity-40 rounded-full hover:bg-opacity-70 cursor-pointer"
            >
              ‹
            </button>

            <img
              src={allImages[currentIndex]}
              alt="Selected"
              className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
            />

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-5 text-white text-4xl font-bold px-3 py-1 bg-black bg-opacity-40 rounded-full hover:bg-opacity-70 cursor-pointer"
            >
              ›
            </button>
          </div>
        )}

        {/* Details */}
        <div className="md:w-1/2">
          <h1 className="text-2xl font-bold">{house.title}</h1>
          <p className="text-green-600 font-bold text-lg">₦{house.price?.toLocaleString()}</p>
          <p className="text-gray-700 mt-2">{house.location}</p>
          <p className="text-gray-600 mt-1">
            <strong>Type:</strong> {house.apartmentType?.name || "N/A"}
          </p>

          <div className="mt-4 space-y-2">
            <p>
              <strong>Landlord:</strong> {house.landlord?.name || "N/A"}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {house?.fullAddress || "No full address yet"}
            </p>
            <p>
              <strong>Details:</strong>{" "}
              {house.description || "No extra details available"}
            </p>
            <p>
              <strong>Contact:</strong>{" "}
              {house.landlord?.email || "No contact available"}
            </p>
          </div>

          <div className="mt-6">
            <a
              href={`mailto:${house.landlord?.email || '#'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-800 transition"
            >
              Book Appartment
            </a>
          </div>
        </div>
      </div>
      <PropertyReview />
    </div>
  );
}

export default HouseDetails;
