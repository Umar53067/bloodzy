import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="p-4 sm:p-5 border border-gray-200 rounded-lg bg-white animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-2/5 pt-2"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
