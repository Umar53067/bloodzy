import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Custom hook for blood request operations
 * Handles creating, reading, updating blood requests in Supabase
 */
export const useBloodRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a blood request
   */
  const createRequest = useCallback(async (userId, requestData) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('blood_requests')
        .insert([
          {
            user_id: userId,
            patient_name: requestData.patientName,
            blood_group: requestData.bloodGroup,
            units: requestData.units,
            hospital: requestData.hospital,
            city: requestData.city,
            urgency: requestData.urgency || 'normal', // 'low', 'normal', 'urgent'
            status: 'pending', // 'pending', 'fulfilled', 'cancelled'
            description: requestData.description || null,
            contact_phone: requestData.contactPhone,
            contact_email: requestData.contactEmail,
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
   * Get blood request by ID
   */
  const getRequest = useCallback(async (requestId) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('blood_requests')
        .select('*, user:users(username, email)')
        .eq('id', requestId)
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
   * Get all blood requests for a user
   */
  const getUserRequests = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('blood_requests')
        .select('*')
        .eq('user_id', userId)
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
   * Get active blood requests by blood group
   */
  const getRequestsByBloodGroup = useCallback(async (bloodGroup, city = null) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('blood_requests')
        .select('*, user:users(username, email)')
        .eq('blood_group', bloodGroup)
        .eq('status', 'pending')
        .order('urgency', { ascending: false });

      if (city) {
        query = query.eq('city', city);
      }

      const { data, error: err } = await query;

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
   * Update blood request status
   */
  const updateRequest = useCallback(async (requestId, updates) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('blood_requests')
        .update(updates)
        .eq('id', requestId)
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
   * Delete blood request
   */
  const deleteRequest = useCallback(async (requestId) => {
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase
        .from('blood_requests')
        .delete()
        .eq('id', requestId);

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
    createRequest,
    getRequest,
    getUserRequests,
    getRequestsByBloodGroup,
    updateRequest,
    deleteRequest,
  };
};

export default useBloodRequest;
