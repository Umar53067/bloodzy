import React, { useState, useEffect } from "react";
import { useDonationHistory } from "../hooks/useDonationHistory";
import { Calendar, Droplets, TrendingUp, Award } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

/**
 * DonationHistory - Display donation history and statistics
 */
export default function DonationHistory({ userId }) {
  const { getDonationHistory, getDonationStats } = useDonationHistory();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch history
        const { data: historyData, error: historyError } =
          await getDonationHistory(userId, 20);
        if (historyError) throw new Error(historyError);

        // Fetch stats
        const { data: statsData, error: statsError } =
          await getDonationStats(userId);
        if (statsError) throw new Error(statsError);

        setHistory(historyData || []);
        setStats(statsData);
      } catch (err) {
        console.error("Error fetching donation data:", err);
        setError(err.message || "Failed to load donation data");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Donations */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Donations</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.total_donations}
                </p>
              </div>
              <Award className="text-red-600 opacity-20" size={40} />
            </div>
          </div>

          {/* Blood Collected */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Blood Collected</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.total_blood_collected}
                </p>
                <p className="text-xs text-gray-500">ml</p>
              </div>
              <Droplets className="text-blue-600 opacity-20" size={40} />
            </div>
          </div>

          {/* Lives Potentially Saved */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Lives Saved</p>
                <p className="text-3xl font-bold text-green-600">
                  {Math.floor(stats.total_blood_collected / 450) * 3}
                </p>
                <p className="text-xs text-gray-500">estimated</p>
              </div>
              <TrendingUp className="text-green-600 opacity-20" size={40} />
            </div>
          </div>

          {/* Average Days Between */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg. Days Between</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.average_days_between_donations}
                </p>
                <p className="text-xs text-gray-500">days</p>
              </div>
              <Calendar className="text-purple-600 opacity-20" size={40} />
            </div>
          </div>
        </div>
      )}

      {/* Last Donation Info */}
      {stats && stats.most_recent_donation && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="text-red-600" size={20} />
            Most Recent Donation
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Date</p>
              <p className="font-semibold text-gray-800">
                {new Date(
                  stats.most_recent_donation.donation_date
                ).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Blood Collected</p>
              <p className="font-semibold text-gray-800">
                {stats.most_recent_donation.blood_collected || 450} ml
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Center/Bank</p>
              <p className="font-semibold text-gray-800">
                {stats.most_recent_donation.blood_bank_name ||
                  stats.most_recent_donation.donation_center ||
                  "Unknown"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Donation History List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">Donation History</h3>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <Droplets className="mx-auto mb-3 opacity-50" size={32} />
            <p>No donation history yet</p>
            <p className="text-sm mt-1">
              Your donations will appear here after your first donation
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                    Blood Collected
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                    Center/Bank
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, index) => (
                  <tr
                    key={record.id}
                    className={`border-b last:border-b-0 ${
                      index % 2 === 0 ? "bg-gray-50" : ""
                    } hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-red-600" />
                        {new Date(record.donation_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="flex items-center gap-2">
                        <Droplets size={16} className="text-blue-600" />
                        {record.blood_collected || 450} ml
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {record.blood_bank_name || record.donation_center || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.notes || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Impact Statement */}
      {stats && stats.total_donations > 0 && (
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3">Your Impact</h3>
          <p className="text-lg leading-relaxed">
            Through your <strong>{stats.total_donations} donations</strong>, you've
            contributed{" "}
            <strong>{stats.total_blood_collected} ml</strong> of blood,
            potentially saving the lives of{" "}
            <strong>{Math.floor(stats.total_blood_collected / 450) * 3} people</strong>.
            Your generosity is truly life-changing! 🩸
          </p>
        </div>
      )}
    </div>
  );
}
