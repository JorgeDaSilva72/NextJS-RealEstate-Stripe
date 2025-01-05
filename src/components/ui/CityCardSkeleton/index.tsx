import React from "react";

const CityCardSkeleton = () => {
  return (
    <div className="h-full rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 w-full bg-gray-200" />

      {/* Content placeholder */}
      <div className="p-6">
        {/* Title placeholder */}
        <div className="h-8 bg-gray-200 rounded-md mb-2 w-3/4" />

        {/* Description placeholder */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>

        {/* Stats placeholder */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>

      {/* Footer placeholder */}
      <div className="p-4 bg-gray-50">
        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
      </div>
    </div>
  );
};

export const CitiesGridSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <CityCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default CityCardSkeleton;
