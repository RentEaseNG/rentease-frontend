import React from 'react';
import Image from './ImageLoader';

const PropertyCard = ({ house, onClick }) => {
  return (
    <div
      onClick={() => onClick(house._id)}
      className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-full"
    >
      <Image
        src={house.images[0]}
        alt={house.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="font-semibold text-lg line-clamp-1">{house.title}</h2>
        <p className="text-green-600 font-bold mt-1">
          ₦{house.price?.toLocaleString()}
        </p>
        <p className="text-gray-500 text-sm line-clamp-1">{house.location}</p>
        <div className="mt-auto pt-4 flex justify-between items-center">
          <p className="text-gray-600 text-xs px-2 py-1 rounded-sm bg-gray-100">
            {house?.apartmentType?.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
