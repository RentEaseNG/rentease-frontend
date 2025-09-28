import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function FeaturedProperties({ query }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]); // ✅ local state for houses
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/properties");
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
    return <div className="p-6 text-gray-600">Loading properties...</div>;
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
            <div
              key={house._id}
              onClick={() => handleCardClick(house._id)}
              className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={house.images[0]}
                alt={house.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold text-lg">{house.title}</h2>
                <p className="text-green-600 font-bold mt-1">₦{house.price?.toLocaleString()}</p>
                <p className="text-gray-500 text-sm">{house.location}</p>
                <p className="text-gray-600 text-sm mt-2 w-fit pl-2 pr-2 rounded-sm bg-gray-200 ml-auto">
                  {house?.apartmentType?.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FeaturedProperties;
