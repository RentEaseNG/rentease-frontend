import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/client";
import PropertyCard from "../components/PropertyCard";

function FeaturedProperties({ query }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]); // ✅ local state for houses
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await apiClient.get("/properties");
        setHouses(res.data.data || []); // ✅ store API response in state
      } catch (err) {
        console.error("Error fetching houses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, []);

  // 🔎 Client-side filtering
  const filteredHouses = houses.filter((house) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      house.title.toLowerCase().includes(q) ||
      house.location.toLowerCase().includes(q) ||
      house.apartmentType?.name.toLowerCase().includes(q)
    );
  });

  const handleCardClick = (houseId) => {
    if (user) {
      navigate(`/house/${houseId}`);
    } else {
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Available Properties
      </h1>

      {filteredHouses.length === 0 ? (
        <p className="text-gray-500">No properties found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredHouses.map((house) => (
            <PropertyCard
              key={house._id}
              house={house}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FeaturedProperties;
