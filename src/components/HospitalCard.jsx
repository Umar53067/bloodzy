import React from "react";
import { Phone, Mail, MapPin, Clock, AlertCircle } from "lucide-react";

/**
 * HospitalCard Component - Displays a single hospital's information
 */
export default function HospitalCard({ hospital, onSelect }) {
  const {
    id,
    name,
    city,
    address,
    phone,
    email,
    blood_bank,
    blood_types,
    emergency_24h,
    verified,
    location,
  } = hospital;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-red-500">
      {/* Header with name and badges */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">{city}</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {verified && (
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
              ✓ Verified
            </span>
          )}
          {emergency_24h && (
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <Clock size={12} /> 24/7
            </span>
          )}
          {blood_bank && (
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
              🩸 Blood Bank
            </span>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-red-500 mt-1 flex-shrink-0" />
          <p className="text-sm text-gray-700">{address}</p>
        </div>

        {phone && (
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-green-500 flex-shrink-0" />
            <a
              href={`tel:${phone}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {phone}
            </a>
          </div>
        )}

        {email && (
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-purple-500 flex-shrink-0" />
            <a
              href={`mailto:${email}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {email}
            </a>
          </div>
        )}
      </div>

      {/* Blood Types */}
      {blood_types && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            Blood Types Available:
          </p>
          <div className="flex flex-wrap gap-2">
            {blood_types.split(",").map((type) => (
              <span
                key={type.trim()}
                className="bg-red-50 text-red-800 text-xs font-semibold px-2 py-1 rounded"
              >
                {type.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Coordinates */}
      <div className="text-xs text-gray-500 mb-4">
        Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
      </div>

      {/* Action Button */}
      <button
        onClick={() => onSelect && onSelect(hospital)}
        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
      >
        View Details & Contact
      </button>
    </div>
  );
}
