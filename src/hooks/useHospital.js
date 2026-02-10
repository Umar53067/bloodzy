import { supabase } from "../lib/supabase";

/**
 * Custom hook for hospital-related operations
 */

export const useHospital = () => {
  /**
   * Get all hospitals or filter by city
   * @param {string} city - Optional city filter
   * @returns {Promise} - { data, error }
   */
  const getHospitals = async (city = null) => {
    try {
      let query = supabase.from("hospitals").select("*");

      if (city) {
        query = query.eq("city", city);
      }

      const { data, error } = await query.order("name", {
        ascending: true,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      return { data: null, error: error.message };
    }
  };

  /**
   * Get verified hospitals only
   * @param {string} city - Optional city filter
   * @returns {Promise} - { data, error }
   */
  const getVerifiedHospitals = async (city = null) => {
    try {
      let query = supabase
        .from("hospitals")
        .select("*")
        .eq("verified", true);

      if (city) {
        query = query.eq("city", city);
      }

      const { data, error } = await query.order("name", {
        ascending: true,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching verified hospitals:", error);
      return { data: null, error: error.message };
    }
  };

  /**
   * Get hospitals with blood bank
   * @param {string} city - Optional city filter
   * @returns {Promise} - { data, error }
   */
  const getBloodBanks = async (city = null) => {
    try {
      let query = supabase.from("hospitals").select("*").eq("blood_bank", true);

      if (city) {
        query = query.eq("city", city);
      }

      const { data, error } = await query.order("name", {
        ascending: true,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching blood banks:", error);
      return { data: null, error: error.message };
    }
  };

  /**
   * Get hospitals with 24-hour emergency service
   * @param {string} city - Optional city filter
   * @returns {Promise} - { data, error }
   */
  const getEmergencyHospitals = async (city = null) => {
    try {
      let query = supabase
        .from("hospitals")
        .select("*")
        .eq("emergency_24h", true);

      if (city) {
        query = query.eq("city", city);
      }

      const { data, error } = await query.order("name", {
        ascending: true,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching emergency hospitals:", error);
      return { data: null, error: error.message };
    }
  };

  /**
   * Search hospitals by name or blood type
   * @param {string} searchTerm - Search term
   * @param {string} city - Optional city filter
   * @returns {Promise} - { data, error }
   */
  const searchHospitals = async (searchTerm, city = null) => {
    try {
      let query = supabase
        .from("hospitals")
        .select("*")
        .or(
          `name.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,blood_types.ilike.%${searchTerm}%`
        );

      if (city) {
        query = query.eq("city", city);
      }

      const { data, error } = await query.order("name", {
        ascending: true,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error searching hospitals:", error);
      return { data: null, error: error.message };
    }
  };

  /**
   * Get single hospital by ID
   * @param {number} id - Hospital ID
   * @returns {Promise} - { data, error }
   */
  const getHospitalById = async (id) => {
    try {
      const { data, error } = await supabase
        .from("hospitals")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching hospital:", error);
      return { data: null, error: error.message };
    }
  };

  /**
   * Get hospitals with specific blood type
   * @param {string} bloodType - Blood type (e.g., "O+")
   * @param {string} city - Optional city filter
   * @returns {Promise} - { data, error }
   */
  const getHospitalsByBloodType = async (bloodType, city = null) => {
    try {
      let query = supabase
        .from("hospitals")
        .select("*")
        .ilike("blood_types", `%${bloodType}%`);

      if (city) {
        query = query.eq("city", city);
      }

      const { data, error } = await query.order("name", {
        ascending: true,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching hospitals by blood type:", error);
      return { data: null, error: error.message };
    }
  };

  /**
   * Get distinct cities with hospitals
   * @returns {Promise} - { data, error }
   */
  const getCitiesWithHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from("hospitals")
        .select("city")
        .distinct();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching cities:", error);
      return { data: null, error: error.message };
    }
  };

  return {
    getHospitals,
    getVerifiedHospitals,
    getBloodBanks,
    getEmergencyHospitals,
    searchHospitals,
    getHospitalById,
    getHospitalsByBloodType,
    getCitiesWithHospitals,
  };
};
