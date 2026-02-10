import React, { useState, useEffect } from "react";
import { useDonationHistory } from "../hooks/useDonationHistory";
import {
  getEarnedBadges,
  getNextBadgeMilestone,
  getBadgeRank,
  getRankColor,
} from "../lib/badgeSystem";
import { Trophy, Target, Lock } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

/**
 * DonorBadges - Display earned badges and badge progress
 */
export default function DonorBadges({ userId, userData = {} }) {
  const { getDonationStats } = useDonationHistory();
  const [stats, setStats] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [nextBadge, setNextBadge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: statsData, error: statsError } =
          await getDonationStats(userId);
        if (statsError) throw new Error(statsError);

        setStats(statsData);

        if (statsData) {
          const earned = getEarnedBadges(statsData, userData);
          const next = getNextBadgeMilestone(statsData, userData);

          setEarnedBadges(earned);
          setNextBadge(next);
        }
      } catch (err) {
        console.error("Error fetching badge data:", err);
        setError(err.message || "Failed to load badges");
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

  const rank = getBadgeRank(earnedBadges);
  const rankColor = getRankColor(rank);

  return (
    <div className="space-y-6">
      {/* Rank Section */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg p-6">
        <div className="flex items-center gap-4">
          <Trophy size={48} />
          <div>
            <p className="text-amber-100 text-sm">Your Rank</p>
            <h2 className="text-4xl font-bold">{rank}</h2>
            <p className="text-amber-100 text-sm mt-1">
              {earnedBadges.length} badges earned
            </p>
          </div>
        </div>
      </div>

      {/* Earned Badges */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Trophy className="text-amber-600" size={24} />
          Earned Badges ({earnedBadges.length})
        </h3>

        {earnedBadges.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-600">
            <Trophy className="mx-auto mb-3 opacity-30" size={40} />
            <p>No badges yet. Start donating to earn your first badge!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-lg p-4 text-center transform hover:scale-105 transition-transform cursor-pointer ${badge.color} border-2 border-current`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                <p className="text-xs opacity-75">{badge.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next Badge */}
      {nextBadge && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
          <div className="flex items-start gap-4">
            <Target className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 mb-2">Next Badge</h4>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{nextBadge.badge.icon}</span>
                <div>
                  <h5 className="font-semibold text-gray-800">
                    {nextBadge.badge.name}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {nextBadge.badge.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {nextBadge.progress.current} / {nextBadge.progress.target}
                  </span>
                  <span className="font-semibold text-blue-600">
                    {nextBadge.progress.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${nextBadge.progress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Badges Display (Locked/Unlocked) */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">All Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* This would be populated with all badges - showing as example */}
          <BadgeShowcase
            badge={{
              id: "first_donation",
              name: "First Drop",
              icon: "🩸",
              description: "1 donation",
            }}
            unlocked={earnedBadges.some((b) => b.id === "first_donation")}
          />
          <BadgeShowcase
            badge={{
              id: "five_donations",
              name: "Regular Donor",
              icon: "🎖️",
              description: "5 donations",
            }}
            unlocked={earnedBadges.some((b) => b.id === "five_donations")}
          />
          <BadgeShowcase
            badge={{
              id: "ten_donations",
              name: "Dedicated Hero",
              icon: "⭐",
              description: "10 donations",
            }}
            unlocked={earnedBadges.some((b) => b.id === "ten_donations")}
          />
          <BadgeShowcase
            badge={{
              id: "twenty_donations",
              name: "Lifesaver",
              icon: "🏆",
              description: "20 donations",
            }}
            unlocked={earnedBadges.some((b) => b.id === "twenty_donations")}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * BadgeShowcase - Individual badge display (locked/unlocked)
 */
function BadgeShowcase({ badge, unlocked }) {
  return (
    <div
      className={`rounded-lg p-4 text-center border-2 transition-all ${
        unlocked
          ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 shadow-md"
          : "bg-gray-100 border-gray-300 opacity-50"
      }`}
    >
      <div className={`text-4xl mb-2 ${unlocked ? "" : "filter grayscale"}`}>
        {badge.icon}
      </div>
      {!unlocked && (
        <Lock className="absolute top-2 right-2 text-gray-400" size={16} />
      )}
      <h4 className="font-semibold text-sm mb-1 text-gray-800">
        {badge.name}
      </h4>
      <p className="text-xs text-gray-600">{badge.description}</p>
      {unlocked && (
        <span className="inline-block mt-2 text-xs font-bold px-2 py-1 bg-green-200 text-green-800 rounded-full">
          Unlocked
        </span>
      )}
    </div>
  );
}
