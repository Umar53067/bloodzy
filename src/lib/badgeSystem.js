/**
 * Donor Badges System
 * Award badges to donors based on their contributions and activity
 */

export const BADGES = {
  FIRST_DONATION: {
    id: "first_donation",
    name: "First Drop",
    description: "Completed your first blood donation",
    icon: "🩸",
    color: "bg-red-100 text-red-800",
    requirement: (stats) => stats.total_donations >= 1,
  },
  FIVE_DONATIONS: {
    id: "five_donations",
    name: "Regular Donor",
    description: "Completed 5 blood donations",
    icon: "🎖️",
    color: "bg-orange-100 text-orange-800",
    requirement: (stats) => stats.total_donations >= 5,
  },
  TEN_DONATIONS: {
    id: "ten_donations",
    name: "Dedicated Hero",
    description: "Completed 10 blood donations",
    icon: "⭐",
    color: "bg-yellow-100 text-yellow-800",
    requirement: (stats) => stats.total_donations >= 10,
  },
  TWENTY_DONATIONS: {
    id: "twenty_donations",
    name: "Lifesaver",
    description: "Completed 20 blood donations",
    icon: "🏆",
    color: "bg-blue-100 text-blue-800",
    requirement: (stats) => stats.total_donations >= 20,
  },
  FIFTY_DONATIONS: {
    id: "fifty_donations",
    name: "Legend",
    description: "Completed 50 blood donations",
    icon: "👑",
    color: "bg-purple-100 text-purple-800",
    requirement: (stats) => stats.total_donations >= 50,
  },
  ONE_LITER: {
    id: "one_liter",
    name: "Gallon Giver",
    description: "Donated 1 liter (1000 ml) of blood",
    icon: "🥤",
    color: "bg-green-100 text-green-800",
    requirement: (stats) => stats.total_blood_collected >= 1000,
  },
  TWO_LITERS: {
    id: "two_liters",
    name: "Double Impact",
    description: "Donated 2 liters (2000 ml) of blood",
    icon: "🎯",
    color: "bg-emerald-100 text-emerald-800",
    requirement: (stats) => stats.total_blood_collected >= 2000,
  },
  CONSISTENT: {
    id: "consistent",
    name: "Consistently Giving",
    description: "Donated regularly with less than 80 days between donations",
    icon: "📈",
    color: "bg-cyan-100 text-cyan-800",
    requirement: (stats) =>
      stats.average_days_between_donations > 0 &&
      stats.average_days_between_donations <= 80,
  },
  ACTIVE_MEMBER: {
    id: "active_member",
    name: "Active Member",
    description: "Member for 6 months with at least 3 donations",
    icon: "✨",
    color: "bg-pink-100 text-pink-800",
    requirement: (stats, userData) => {
      if (!userData || !userData.created_at) return false;
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return (
        new Date(userData.created_at) <= sixMonthsAgo &&
        stats.total_donations >= 3
      );
    },
  },
  MENTOR: {
    id: "mentor",
    name: "Mentor",
    description: "Helped recruit 5 new donors",
    icon: "👨‍🏫",
    color: "bg-indigo-100 text-indigo-800",
    requirement: (stats, userData) => userData?.referred_count >= 5,
  },
};

/**
 * Get earned badges for a donor
 * @param {Object} stats - Donation statistics
 * @param {Object} userData - User data
 * @returns {Array} Array of earned badges
 */
export const getEarnedBadges = (stats, userData = {}) => {
  const earned = [];

  Object.values(BADGES).forEach((badge) => {
    if (badge.requirement(stats, userData)) {
      earned.push(badge);
    }
  });

  return earned;
};

/**
 * Get next badge milestone
 * @param {Object} stats - Donation statistics
 * @param {Object} userData - User data
 * @returns {Object|null} Next badge to earn or null
 */
export const getNextBadgeMilestone = (stats, userData = {}) => {
  const earned = getEarnedBadges(stats, userData);
  const earnedIds = earned.map((b) => b.id);

  // Define progression order
  const progressionOrder = [
    "first_donation",
    "five_donations",
    "consistent",
    "ten_donations",
    "one_liter",
    "twenty_donations",
    "two_liters",
    "fifty_donations",
    "active_member",
    "mentor",
  ];

  for (const badgeId of progressionOrder) {
    if (!earnedIds.includes(badgeId)) {
      const badge = BADGES[badgeId.toUpperCase()];
      if (badge) {
        return {
          badge,
          progress: calculateBadgeProgress(badgeId, stats, userData),
        };
      }
    }
  }

  return null;
};

/**
 * Calculate progress towards a badge
 * @param {String} badgeId - Badge ID
 * @param {Object} stats - Donation statistics
 * @param {Object} userData - User data
 * @returns {Object} { current, target, percentage }
 */
export const calculateBadgeProgress = (badgeId, stats, userData = {}) => {
  switch (badgeId) {
    case "first_donation":
      return {
        current: Math.min(stats.total_donations, 1),
        target: 1,
        percentage: Math.round((Math.min(stats.total_donations, 1) / 1) * 100),
      };

    case "five_donations":
      return {
        current: Math.min(stats.total_donations, 5),
        target: 5,
        percentage: Math.round(
          (Math.min(stats.total_donations, 5) / 5) * 100
        ),
      };

    case "ten_donations":
      return {
        current: Math.min(stats.total_donations, 10),
        target: 10,
        percentage: Math.round(
          (Math.min(stats.total_donations, 10) / 10) * 100
        ),
      };

    case "twenty_donations":
      return {
        current: Math.min(stats.total_donations, 20),
        target: 20,
        percentage: Math.round(
          (Math.min(stats.total_donations, 20) / 20) * 100
        ),
      };

    case "fifty_donations":
      return {
        current: Math.min(stats.total_donations, 50),
        target: 50,
        percentage: Math.round(
          (Math.min(stats.total_donations, 50) / 50) * 100
        ),
      };

    case "one_liter":
      return {
        current: Math.min(stats.total_blood_collected, 1000),
        target: 1000,
        percentage: Math.round(
          (Math.min(stats.total_blood_collected, 1000) / 1000) * 100
        ),
      };

    case "two_liters":
      return {
        current: Math.min(stats.total_blood_collected, 2000),
        target: 2000,
        percentage: Math.round(
          (Math.min(stats.total_blood_collected, 2000) / 2000) * 100
        ),
      };

    case "mentor":
      const referredCount = userData?.referred_count || 0;
      return {
        current: Math.min(referredCount, 5),
        target: 5,
        percentage: Math.round((Math.min(referredCount, 5) / 5) * 100),
      };

    default:
      return { current: 0, target: 1, percentage: 0 };
  }
};

/**
 * Get badge rank based on number of badges
 * @param {Array} badges - Earned badges
 * @returns {String} Rank (Bronze, Silver, Gold, Platinum, Diamond)
 */
export const getBadgeRank = (badges) => {
  const count = badges?.length || 0;
  if (count === 0) return "Newcomer";
  if (count <= 2) return "Bronze";
  if (count <= 4) return "Silver";
  if (count <= 6) return "Gold";
  if (count <= 8) return "Platinum";
  return "Diamond";
};

/**
 * Get badge rank color
 * @param {String} rank - Rank name
 * @returns {String} Tailwind color class
 */
export const getRankColor = (rank) => {
  switch (rank) {
    case "Bronze":
      return "text-yellow-700 bg-yellow-100";
    case "Silver":
      return "text-gray-700 bg-gray-100";
    case "Gold":
      return "text-yellow-600 bg-yellow-100";
    case "Platinum":
      return "text-blue-600 bg-blue-100";
    case "Diamond":
      return "text-purple-600 bg-purple-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};
