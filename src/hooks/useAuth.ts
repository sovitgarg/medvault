import { useState, useEffect } from 'react';
import { initGoogleAuth, signInWithGoogle, getUserProfile, signOut as authSignOut } from '../services/googleAuth';
import { isAuthenticated as checkAuth, getAccessToken, getUserInfo } from '../services/tokenManager';
import type { AuthState } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

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
  }, []);

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
