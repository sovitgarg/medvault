import { useState, useEffect, useRef } from 'react';
import { initGoogleAuth, signInWithGoogle, getUserProfile, signOut as authSignOut, refreshAccessToken } from '../services/googleAuth';
import { isAuthenticated as checkAuth, getAccessToken, getUserInfo, isTokenExpired } from '../services/tokenManager';
import type { AuthState } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });
  const refreshTimerRef = useRef<NodeJS.Timeout>();

  // Initialize auth on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        await initGoogleAuth();

        // Check if user is already authenticated
        const isAuth = checkAuth();
        if (isAuth) {
          const token = getAccessToken();
          const user = getUserInfo();

          setAuthState({
            user,
            accessToken: token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          // Start token refresh monitoring
          startTokenRefreshMonitor();
        } else {
          setAuthState((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error: 'Failed to initialize authentication',
        }));
      }
    };

    initialize();

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, []);

  // Monitor token expiry and refresh automatically
  const startTokenRefreshMonitor = () => {
    // Check every 5 minutes
    refreshTimerRef.current = setInterval(async () => {
      if (isTokenExpired()) {
        console.log('Token expired, attempting silent refresh...');
        try {
          const { token } = await refreshAccessToken();
          setAuthState((prev) => ({
            ...prev,
            accessToken: token,
          }));
          console.log('Token refreshed successfully');
        } catch (error) {
          console.error('Failed to refresh token, logging out...', error);
          logout();
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
  };

  const login = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const { token } = await signInWithGoogle();
      const user = await getUserProfile(token);

      setAuthState({
        user,
        accessToken: token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      // Start token refresh monitoring after login
      startTokenRefreshMonitor();
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to sign in',
      }));
      throw error;
    }
  };

  const logout = () => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }
    authSignOut();
    setAuthState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
};
