import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Clock, Heart, Droplets } from "lucide-react";
import { formatEligibilityInfo } from "../lib/eligibilityChecker";

/**
 * EligibilityStatus - Display donation eligibility information
 */
export default function EligibilityStatus({ donor }) {
  const [eligibilityInfo, setEligibilityInfo] = useState(null);

  useEffect(() => {
    if (donor) {
      const info = formatEligibilityInfo(donor);
      setEligibilityInfo(info);
    }
  }, [donor]);

  if (!eligibilityInfo) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600">Loading eligibility information...</p>
      </div>
    );
  }

  const { eligible, score, reasons, daysUntilNext, message, lastDonationDate } =
    eligibilityInfo;

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <div
        className={`rounded-lg p-6 text-white ${
          eligible ? "bg-gradient-to-r from-green-600 to-green-700" : "bg-gradient-to-r from-orange-600 to-orange-700"
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {eligible ? (
              <CheckCircle size={32} />
            ) : (
              <AlertCircle size={32} />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">
              {eligible ? "Eligible to Donate" : "Not Currently Eligible"}
            </h3>
            <p className="text-lg text-opacity-90">{message}</p>
          </div>
        </div>
      </div>

      {/* Score Bar */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-gray-800">Eligibility Score</h4>
          <span className="text-2xl font-bold text-red-600">{score}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              score >= 80
                ? "bg-green-600"
                : score >= 60
                ? "bg-yellow-600"
                : "bg-red-600"
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Last Donation Information */}
      {donor.last_donation && (
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Droplets className="text-red-600" size={24} />
            <h4 className="font-semibold text-gray-800">Donation History</h4>
          </div>
          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-medium">Last Donation:</span>{" "}
              {lastDonationDate}
            </p>
            {daysUntilNext && daysUntilNext > 0 && (
              <p>
                <span className="font-medium">Next Eligible Date:</span>{" "}
                <span className="text-orange-600 font-semibold">
                  In {daysUntilNext} days
                </span>
              </p>
            )}
            {daysUntilNext === 0 && (
              <p className="text-green-600 font-semibold">
                ✓ Ready to donate again!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Ineligibility Reasons */}
      {reasons.length > 0 && (
        <div className="bg-red-50 rounded-lg p-6 shadow-md border border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
            <h4 className="font-semibold text-gray-800">Eligibility Issues</h4>
          </div>
          <ul className="space-y-3">
            {reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-red-600 font-bold mt-1">•</span>
                <span className="text-gray-700">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Health Recommendations */}
      {eligible && (
        <div className="bg-green-50 rounded-lg p-6 shadow-md border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="text-green-600" size={24} />
            <h4 className="font-semibold text-gray-800">
              Before You Donate
            </h4>
          </div>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>✓ Get a good night's sleep</li>
            <li>✓ Eat a healthy meal before donation</li>
            <li>✓ Drink plenty of water</li>
            <li>✓ Avoid alcohol for 24 hours after donation</li>
            <li>✓ Take it easy for the rest of the day</li>
            <li>✓ Avoid strenuous activities for 48 hours</li>
          </ul>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-3xl font-bold text-red-600 mb-1">
            {donor.age}
          </div>
          <p className="text-sm text-gray-600">Years Old</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {donor.blood_group}
          </div>
          <p className="text-sm text-gray-600">Blood Group</p>
        </div>
      </div>
    </div>
  );
}
