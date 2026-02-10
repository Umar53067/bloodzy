import React from 'react';

/**
 * DonorList component
 * Displays a list of donors in a grid layout
 */
function DonorList({ donors, children, emptyMessage = 'No donors found' }) {
  if (!donors || donors.length === 0) {
    return (
      <div
        className="text-center py-12 bg-gray-50 rounded-lg"
        role="status"
        aria-live="polite"
      >
        <p className="text-gray-600 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      role="list"
      aria-label="Donor list"
    >
      {donors.map((donor) => (
        <div key={donor.id} role="listitem">
          {children(donor)}
        </div>
      ))}
    </div>
  );
}

export default DonorList;
