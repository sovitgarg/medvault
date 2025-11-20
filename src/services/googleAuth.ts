import { GOOGLE_CLIENT_ID, GOOGLE_SCOPES } from '../utils/constants';
import { storeAccessToken, storeUserInfo, clearTokens } from './tokenManager';
import type { User } from '../types';

declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string; expires_in: number }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
        };
      };
    };
  }
}

/**
 * Initialize Google OAuth client
 */
export const initGoogleAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google OAuth script'));

    document.body.appendChild(script);
  });
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = (silent: boolean = false): Promise<{ token: string; expiresIn: number }> => {
  return new Promise((resolve, reject) => {
    console.log('signInWithGoogle called, silent:', silent);
    console.log('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);
    console.log('GOOGLE_SCOPES:', GOOGLE_SCOPES);

    if (!window.google) {
      console.error('Google OAuth not initialized - window.google is undefined');
      reject(new Error('Google OAuth not initialized'));
      return;
    }

    console.log('Creating Google OAuth token client...');
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: GOOGLE_SCOPES,
      callback: (response) => {
        console.log('OAuth callback received:', response);
        if (response.access_token) {
          console.log('Access token received, storing...');
          storeAccessToken(response.access_token, response.expires_in);
          resolve({
            token: response.access_token,
            expiresIn: response.expires_in,
          });
        } else {
          console.error('No access token in response');
          reject(new Error('Failed to get access token'));
        }
      },
    });

    console.log('Requesting access token...');
    // @ts-ignore - prompt option exists but not in type definition
    client.requestAccessToken({ prompt: silent ? '' : 'consent' });
  });
};

/**
 * Silently refresh access token
 */
export const refreshAccessToken = async (): Promise<{ token: string; expiresIn: number }> => {
  try {
    return await signInWithGoogle(true);
  } catch (error) {
    console.error('Silent token refresh failed:', error);
    throw error;
  }
};

/**
 * Get user profile information
 */
export const getUserProfile = async (accessToken: string): Promise<User> => {
  try {
    console.log('Fetching user profile...');
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('User profile response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to get user profile:', errorText);
      throw new Error('Failed to get user profile');
    }

    const data = await response.json();
    console.log('User profile data:', data);

    const user: User = {
      id: data.id,
      email: data.email,
      name: data.name,
      picture: data.picture,
    };

    console.log('Storing user info:', user);
    storeUserInfo(user);
    return user;
  } catch (error) {
    console.error('getUserProfile error:', error);
    throw new Error('Failed to get user profile');
  }
};

/**
 * Sign out
 */
export const signOut = (): void => {
  clearTokens();
  // Optionally revoke token with Google
  window.location.reload();
};
