import React from 'react';

/**
 * DonorCard component
 * Displays individual donor information in a card format
 */
function DonorCard({ donor, onViewDetails = null, onContact = null }) {
  return (
    <div
      className="bg-white rounded-lg shadow p-4 border-l-4 border-red-600"
      role="article"
      aria-label={`${donor.name} - Blood ${donor.bloodGroup}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{donor.name}</h3>
          <p className="text-sm text-gray-600">{donor.city}</p>
        </div>
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-bold text-sm">
          {donor.bloodGroup}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div>
          <span className="text-gray-600">Age:</span>
          <p className="font-semibold text-gray-900">{donor.age} years</p>
        </div>
        <div>
          <span className="text-gray-600">Gender:</span>
          <p className="font-semibold text-gray-900">{donor.gender}</p>
        </div>
        <div>
          <span className="text-gray-600">Phone:</span>
          <p className="font-semibold text-gray-900">{donor.phone}</p>
        </div>
        <div>
          <span className="text-gray-600">Distance:</span>
          <p className="font-semibold text-gray-900">{donor.distance || 'N/A'}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(donor)}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm font-semibold"
            aria-label={`View details for ${donor.name}`}
          >
            View Details
          </button>
        )}
        {onContact && (
          <button
            onClick={() => onContact(donor)}
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-sm font-semibold"
            aria-label={`Contact ${donor.name}`}
          >
            Contact
          </button>
        )}
      </div>
    </div>
  );
}

export default DonorCard;
