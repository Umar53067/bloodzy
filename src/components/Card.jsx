import React from 'react';

/**
 * Reusable Card component
 * Provides consistent container styling for content
 */
function Card({ children, className = '', padding = 'p-6', shadow = 'shadow-lg' }) {
  return (
    <div className={`bg-white rounded-lg ${padding} ${shadow} ${className}`}>
      {children}
    </div>
  );
}

export default Card;
