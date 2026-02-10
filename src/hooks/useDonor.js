import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Custom hook for donor profile operations
 * Handles creating, reading, updating donor information in Supabase
 */
export const useDonor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a donor profile
   */
  const createDonor = useCallback(async (userId, donorData) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('donors')
        .insert([
          {
            user_id: userId,
            blood_group: donorData.bloodGroup,
            age: donorData.age,
            gender: donorData.gender,
            phone: donorData.phone,
            city: donorData.city,
            available: donorData.available !== false,
            last_donation: donorData.lastDonation || null,
            location: donorData.location || null,
            created_at: new Date().toISOString(),
          }
        ])
        .select();

      if (err) throw new Error(err.message);
      return { data: data?.[0], error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get donor profile by user ID
   */
  const getDonor = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('donors')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (err && err.code !== 'PGRST116') throw new Error(err.message); // PGRST116 = no rows
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update donor profile
   */
  const updateDonor = useCallback(async (userId, updates) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('donors')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (err) throw new Error(err.message);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search nearby donors
   */
  const searchNearbyDonors = useCallback(async (bloodGroup, city, limit = 50) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('donors')
        .select('*, user:users(username, email)')
        .eq('available', true);

      if (bloodGroup) {
        query = query.eq('blood_group', bloodGroup);
      }

      if (city) {
        query = query.eq('city', city);
      }

      const { data, error: err } = await query
        .limit(limit)
        .order('created_at', { ascending: false });

      if (err) throw new Error(err.message);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get all donors (admin)
   */
  const getAllDonors = useCallback(async (limit = 100) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('donors')
        .select('*, user:users(username, email)')
        .limit(limit)
        .order('created_at', { ascending: false });

      if (err) throw new Error(err.message);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete donor profile
   */
  const deleteDonor = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase
        .from('donors')
        .delete()
        .eq('user_id', userId);

      if (err) throw new Error(err.message);
      return { error: null };
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createDonor,
    getDonor,
    updateDonor,
    searchNearbyDonors,
    getAllDonors,
    deleteDonor,
  };
};

export default useDonor;
