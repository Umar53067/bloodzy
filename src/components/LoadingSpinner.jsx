import React from 'react';

/**
 * LoadingSpinner component
 * Displays an animated loading spinner with optional message
 * 
 * @param {Object} props
 * @param {string} props.message - Optional loading message
 * @param {string} props.size - Spinner size: 'sm', 'md', 'lg'
 * @param {string} props.fullScreen - Whether to display as full screen overlay
 */
function LoadingSpinner({
  message = 'Loading...',
  size = 'md',
  fullScreen = false
}) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated spinner */}
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-red-300 border-r-red-300 animate-spin"></div>
      </div>
      {message && (
        <p className="text-gray-600 font-medium text-center">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 shadow-2xl">
          {spinner}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-12">
      {spinner}
    </div>
  );
}

export default LoadingSpinner;
