// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
export const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';

// Google Drive API Scopes (Full Access)
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/drive',
].join(' ');

// Google Drive API Endpoints
export const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
export const DRIVE_UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';

// MIME Types
export const MIME_TYPES = {
  FOLDER: 'application/vnd.google-apps.folder',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  PDF: 'application/pdf',
} as const;

// File Upload Settings
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

// App Configuration
export const APP_NAME = 'MedVault';
export const APP_DESCRIPTION = 'Privacy-First Medical Document Manager';

// Session Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'medvault_access_token',
  TOKEN_EXPIRY: 'medvault_token_expiry',
  USER_INFO: 'medvault_user_info',
} as const;
