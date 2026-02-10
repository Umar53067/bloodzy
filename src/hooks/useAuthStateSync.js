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
    // Subscribe to auth state changes
    const subscription = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // User signed in
        dispatch(login({
          user: {
            id: session.user.id,
            email: session.user.email,
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0],
          },
          token: session.access_token,
        }));
      } else if (event === 'SIGNED_OUT') {
        // User signed out
        dispatch(logout());
      } else if (event === 'TOKEN_REFRESHED') {
        // Token was refreshed, update if needed
        if (session?.user) {
          dispatch(login({
            user: {
              id: session.user.id,
              email: session.user.email,
              username: session.user.user_metadata?.username || session.user.email?.split('@')[0],
            },
            token: session.access_token,
          }));
        }
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
