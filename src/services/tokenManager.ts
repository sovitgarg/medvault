import { STORAGE_KEYS } from '../utils/constants';
import type { User } from '../types';

/**
 * Store access token in local storage
 */
export const storeAccessToken = (token: string, expiresIn: number): void => {
  const expiryTime = Date.now() + expiresIn * 1000;
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
};

/**
 * Get access token from local storage
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (): boolean => {
  const expiryTime = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
  if (!expiryTime) return true;

  return Date.now() >= parseInt(expiryTime, 10);
};

/**
 * Clear all stored tokens and user info
 */
export const clearTokens = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
  localStorage.removeItem(STORAGE_KEYS.USER_INFO);
};

/**
 * Store user info in local storage
 */
export const storeUserInfo = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
};

/**
 * Get user info from local storage
 */
export const getUserInfo = (): User | null => {
  const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
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
