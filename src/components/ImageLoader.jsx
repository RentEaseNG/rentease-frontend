import React, { useState } from "react";

const Image = ({ src, alt, className }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={`relative ${className} overflow-hidden`}>
      {loading && !error && (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 animate-pulse rounded">
          <span className="text-gray-500 text-sm">Loading...</span>
        </div>
      )}

      {!error ? (
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto transition-opacity duration-300 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded">
          <img src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=" alt={alt} />
        </div>
      )}
    </div>
  );
};

export default Image;
