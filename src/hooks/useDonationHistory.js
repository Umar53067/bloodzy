import { supabase } from "../lib/supabase";

/**
 * Custom hook for donation history operations
 */

export const useDonationHistory = () => {
  /**
   * Record a new donation
   * @param {string} userId - User ID
   * @param {Object} donationData - Donation details
   * @returns {Promise} - { data, error }
   */
  const recordDonation = async (userId, donationData) => {
    try {
      // Update donor's last_donation field
      const { data: updateData, error: updateError } = await supabase
        .from("donors")
        .update({
          last_donation: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      // Insert donation record (assuming a donation_records table exists)
      const { data, error } = await supabase
        .from("donation_records")
        .insert([
          {
            user_id: userId,
            donation_date: new Date().toISOString(),
            blood_collected: donationData.blood_collected || 450, // ml
            donation_center: donationData.donation_center || "Unknown",
            blood_bank_name: donationData.blood_bank_name || null,
            notes: donationData.notes || null,
          },
        ])
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error recording donation:", error);
      return { data: null, error: error.message };
    }
  };

  /**
   * Get donation history for a user
   * @param {string} userId - User ID
   * @param {number} limit - Number of records to fetch
   * @returns {Promise} - { data, error }
   */
  const getDonationHistory = async (userId, limit = 10) => {
    try {
      const { data, error } = await supabase
        .from("donation_records")
        .select("*")
        .eq("user_id", userId)
        .order("donation_date", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching donation history:", error);
      return { data: null, error: error.message };
    }
  };

  /**
   * Get donation statistics for a user
   * @param {string} userId - User ID
   * @returns {Promise} - { data, error }
   */
  const getDonationStats = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("donation_records")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          data: {
            total_donations: 0,
            total_blood_collected: 0,
            last_donation_date: null,
            average_days_between_donations: 0,
            most_recent_donation: null,
          },
          error: null,
        };
      }

      // Calculate statistics
      const totalDonations = data.length;
      const totalBloodCollected = data.reduce(
        (sum, record) => sum + (record.blood_collected || 0),
        0
      );
      const lastDonationDate = new Date(data[0].donation_date);
      const mostRecentDonation = data[0];

      // Calculate average days between donations
      let averageDaysBetween = 0;
      if (data.length > 1) {
        let totalDays = 0;
        for (let i = 0; i < data.length - 1; i++) {
          const date1 = new Date(data[i].donation_date);
          const date2 = new Date(data[i + 1].donation_date);
          const days = Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));
          totalDays += days;
        }
        averageDaysBetween = Math.round(totalDays / (data.length - 1));
      }

      return {
        data: {
          total_donations: totalDonations,
          total_blood_collected: totalBloodCollected,
          last_donation_date: lastDonationDate,
          average_days_between_donations: averageDaysBetween,
          most_recent_donation: mostRecentDonation,
        },
        error: null,
      };
    } catch (error) {
      console.error("Error calculating donation stats:", error);
      return { data: null, error: error.message };
    }
  };

  /**
   * Get donation records for a date range
   * @param {string} userId - User ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise} - { data, error }
   */
  const getDonationsByDateRange = async (userId, startDate, endDate) => {
    try {
      const { data, error } = await supabase
        .from("donation_records")
        .select("*")
        .eq("user_id", userId)
        .gte("donation_date", startDate.toISOString())
        .lte("donation_date", endDate.toISOString())
        .order("donation_date", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching donations by date range:", error);
      return { data: null, error: error.message };
    }
  };

  /**
   * Delete a donation record (admin only)
   * @param {number} donationId - Donation record ID
   * @returns {Promise} - { data, error }
   */
  const deleteDonationRecord = async (donationId) => {
    try {
      const { data, error } = await supabase
        .from("donation_records")
        .delete()
        .eq("id", donationId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error deleting donation record:", error);
      return { data: null, error: error.message };
    }
  };

  return {
    recordDonation,
    getDonationHistory,
    getDonationStats,
    getDonationsByDateRange,
    deleteDonationRecord,
  };
};
