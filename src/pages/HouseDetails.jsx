import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import houses from "../data/houses.json";

function HouseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const house = houses.find((h) => h.id === parseInt(id));
  const [currentIndex, setCurrentIndex] = useState(null);

  // 🔒 Block guests
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!house) {
    return (
      <div className="p-6">
        <p>House not found.</p>
        <Link to="/" className="text-blue-600 underline">
          Back to listings
        </Link>
      </div>
    );
  }

  // all images (main + extras)
  const allImages = [house.image, ...(house.images || [])];

  // navigation
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link to="/" className="text-blue-600 underline">
        ← Back to listings
      </Link>

      <div className="flex gap-6 mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="w-1/2">
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
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {allImages.slice(1).map((img, index) => (
              <img
                key={index + 1}
                src={img}
                alt={`${house.title} ${index + 1}`}
                onClick={() => setCurrentIndex(index + 1)}
                className="h-32 w-full object-cover rounded-md cursor-pointer hover:opacity-90"
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
          <p className="text-green-600 font-bold text-lg">{house.price}</p>
          <p className="text-gray-700 mt-2">{house.location}</p>
          <p className="text-gray-600 mt-1">
            <strong>Type:</strong> {house.type}
          </p>

          <div className="mt-4 space-y-2">
            <p>
              <strong>Landlord:</strong> {house.landlord || "N/A"}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {house.fullAddress || "No full address yet"}
            </p>
            <p>
              <strong>Details:</strong>{" "}
              {house.description || "No extra details available"}
            </p>
            <p>
              <strong>Contact:</strong>{" "}
              {house.inspectionContact || "No contact available"}
            </p>
          </div>

          <div className="mt-6">
            <a
              href={house.appointmentLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-800 transition"
            >
              Book Appartment
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HouseDetails;
