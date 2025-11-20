import { STORAGE_KEYS } from '../utils/constants';
import type { User } from '../types';

/**
 * Store access token in session storage
 */
export const storeAccessToken = (token: string, expiresIn: number): void => {
  const expiryTime = Date.now() + expiresIn * 1000;
  sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  sessionStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
};

/**
 * Get access token from session storage
 */
export const getAccessToken = (): string | null => {
  return sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (): boolean => {
  const expiryTime = sessionStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
  if (!expiryTime) return true;

  return Date.now() >= parseInt(expiryTime, 10);
};

/**
 * Clear all stored tokens and user info
 */
export const clearTokens = (): void => {
  sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
  sessionStorage.removeItem(STORAGE_KEYS.USER_INFO);
};

/**
 * Store user info in session storage
 */
export const storeUserInfo = (user: User): void => {
  sessionStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
};

/**
 * Get user info from session storage
 */
export const getUserInfo = (): User | null => {
  const userInfo = sessionStorage.getItem(STORAGE_KEYS.USER_INFO);
  if (!userInfo) return null;

  try {
    return JSON.parse(userInfo) as User;
  } catch {
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  const user = getUserInfo();
  return !!token && !!user && !isTokenExpired();
};
