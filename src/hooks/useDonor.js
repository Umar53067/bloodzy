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
      // Format location as GeoJSON Point if provided
      let locationData = null;
      if (donorData.location && donorData.location.latitude !== undefined && donorData.location.longitude !== undefined) {
        locationData = {
          type: 'Point',
          coordinates: [donorData.location.longitude, donorData.location.latitude]
        };
      }

      const { data, error: err } = await supabase
        .from('donors')
        .insert([
          {
            user_id: userId,
            name: donorData.name || 'Donor',
            blood_group: donorData.bloodGroup,
            age: donorData.age,
            gender: donorData.gender,
            phone: donorData.phone,
            city: donorData.city,
            available: donorData.available !== false,
            last_donation: donorData.lastDonation || null,
            location: locationData,
            created_at: new Date().toISOString(),
          }
        ])
        .select();

      if (err) throw new Error(err.message);
      console.log('Donor created with location:', locationData);
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
   * Search nearby donors using server-side distance calculation (RPC)
   * This is much faster than client-side filtering and reduces payload sizes.
   */
  const searchNearbyDonors = useCallback(async (bloodGroup, city, radiusKm = 50, lat = null, lng = null, limit = 50) => {
    setLoading(true);
    setError(null);
    try {
      let data, err;

      // If we have coordinates, use the optimized RPC function for distance
      if (lat !== null && lng !== null) {
        const response = await supabase.rpc('search_donors_by_distance', {
          search_blood_group: bloodGroup || null,
          search_city: city || null,
          search_lat: lat,
          search_lng: lng,
          radius_km: radiusKm,
          max_limit: limit
        });
        data = response.data;
        err = response.error;
      } else {
        // Fallback to normal query without exact count if location is not available
        let query = supabase
          .from('donors')
          .select('*'); // Removed { count: 'exact' } for performance

        if (bloodGroup) {
          query = query.eq('blood_group', bloodGroup);
        }

        if (city) {
          query = query.ilike('city', `%${city}%`);
        }

        const response = await query
          .limit(limit)
          .order('available', { ascending: false })
          .order('created_at', { ascending: false });
          
        data = response.data;
        err = response.error;
      }

      if (err) {
        console.error('Donor search error details:', {
          code: err.code,
          message: err.message,
          details: err.details,
          hint: err.hint
        });
        
        if (err.code === 'PGRST100' || err.message.includes('policy') || err.message.includes('relationship')) {
          throw new Error(`Database access denied. Check RLS policies: ${err.message}`);
        }
        
        throw new Error(err.message || 'Failed to search donors');
      }

      let enrichedData = data || [];
      
      // Optionally fetch user data
      if (enrichedData.length > 0) {
        try {
          const userIds = enrichedData.map(d => d.user_id).filter(Boolean);
          if (userIds.length > 0) {
            const { data: users, error: userError } = await supabase
              .from('users')
              .select('id, username, email')
              .in('id', userIds);
            
            if (!userError && users) {
              const userMap = {};
              users.forEach(u => {
                userMap[u.id] = { username: u.username, email: u.email };
              });
              
              enrichedData = enrichedData.map(d => ({
                ...d,
                user: userMap[d.user_id] || null
              }));
            }
          }
        } catch (userErr) {
          console.warn('Could not fetch user data:', userErr.message);
        }
      }

      console.log(`Search donors - Blood: ${bloodGroup || 'Any'}, City: ${city || 'Any'}, Results: ${enrichedData?.length || 0}`);

      return { data: enrichedData, error: null };
    } catch (err) {
      console.error('Search exception:', err);
      const errorMsg = err.message || 'Unknown error occurred';
      setError(errorMsg);
      return { data: null, error: errorMsg };
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
        .select('*')
        .limit(limit)
        .order('created_at', { ascending: false });

      if (err) throw new Error(err.message);
      
      // Optionally enrich with user data
      let enrichedData = data || [];
      try {
        const userIds = enrichedData.map(d => d.user_id).filter(Boolean);
        if (userIds.length > 0) {
          const { data: users } = await supabase
            .from('users')
            .select('id, username, email')
            .in('id', userIds);
          
          if (users) {
            const userMap = {};
            users.forEach(u => {
              userMap[u.id] = { username: u.username, email: u.email };
            });
            enrichedData = enrichedData.map(d => ({
              ...d,
              user: userMap[d.user_id] || null
            }));
          }
        }
      } catch (userErr) {
        console.warn('Could not fetch user data:', userErr.message);
      }
      
      return { data: enrichedData, error: null };
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
