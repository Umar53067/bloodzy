import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from '../features/auth/authSlice';
import { onAuthStateChange } from '../lib/authService';

/**
 * Custom hook to sync Supabase auth state with Redux
 * Call this in App.jsx to keep auth state in sync
 */
export const useAuthStateSync = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mapSessionToAuthPayload = (session) => ({
      user: {
        id: session.user.id,
        email: session.user.email,
        username:
          session.user.user_metadata?.username ||
          session.user.email?.split('@')[0],
      },
      token: session.access_token,
    });

    // Subscribe to auth state changes
    const subscription = onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session?.user) {
        dispatch(login(mapSessionToAuthPayload(session)));
      } else if (event === 'SIGNED_OUT') {
        dispatch(logout());
      } else if (event === 'INITIAL_SESSION' && !session) {
        dispatch(logout());
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [dispatch]);

  return { loading };
};

export default useAuthStateSync;
