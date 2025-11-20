import { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES, ALLOWED_DOCUMENT_TYPES } from './constants';

/**
 * Validate file name
 */
export const validateFileName = (fileName: string): { valid: boolean; error?: string } => {
  if (!fileName || fileName.trim().length === 0) {
    return { valid: false, error: 'File name cannot be empty' };
  }

  if (fileName.length > 255) {
    return { valid: false, error: 'File name is too long (max 255 characters)' };
  }

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(fileName)) {
    return { valid: false, error: 'File name contains invalid characters' };
  }

  return { valid: true };
};

/**
 * Validate file size
 */
export const validateFileSize = (file: File): { valid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  return { valid: true };
};

/**
 * Validate file type for images
 */
export const validateImageType = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    };
  }

  return { valid: true };
};

/**
 * Validate file type for documents
 */
export const validateDocumentType = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_DOCUMENT_TYPES.join(', ')}`,
    };
  }

  return { valid: true };
};

/**
 * Validate folder name
 */
export const validateFolderName = (folderName: string): { valid: boolean; error?: string } => {
  if (!folderName || folderName.trim().length === 0) {
    return { valid: false, error: 'Folder name cannot be empty' };
  }

  if (folderName.length > 255) {
    return { valid: false, error: 'Folder name is too long (max 255 characters)' };
  }

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(folderName)) {
    return { valid: false, error: 'Folder name contains invalid characters' };
  }

  return { valid: true };
};
