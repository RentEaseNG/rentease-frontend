import React from "react";
import houses from "../data/houses.json";

function TenantDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Available Properties
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {houses.map((house) => (
          <div
            key={house.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={house.image}
              alt={house.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="font-semibold text-lg">{house.title}</h2>
              <p className="text-green-600 font-bold mt-1">{house.price}</p>
              <p className="text-gray-500 text-sm">{house.location}</p>
              <p className="text-gray-600 text-sm mt-2">{house.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TenantDashboard;
