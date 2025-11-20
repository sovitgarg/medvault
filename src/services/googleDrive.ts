import axios from 'axios';
import { DRIVE_API_BASE, DRIVE_UPLOAD_API, MIME_TYPES } from '../utils/constants';
import type { GoogleDriveFile, Folder, ListFilesResponse, UploadFileParams } from '../types';

/**
 * List folders in Google Drive
 */
export const listFolders = async (
  accessToken: string,
  parentFolderId?: string,
  pageSize: number = 100
): Promise<Folder[]> => {
  try {
    // Build query based on whether we're listing root folders or subfolders
    let query = `mimeType='${MIME_TYPES.FOLDER}' and trashed=false`;

    if (parentFolderId) {
      // List folders within a specific parent folder
      query += ` and '${parentFolderId}' in parents`;
    } else {
      // List only root-level folders (no parent or parent is root)
      query += ` and 'root' in parents`;
    }

    const response = await axios.get<ListFilesResponse>(`${DRIVE_API_BASE}/files`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: query,
        fields: 'files(id, name, createdTime, modifiedTime, webViewLink, iconLink)',
        pageSize,
        orderBy: 'modifiedTime desc',
      },
    });

    return response.data.files as Folder[];
  } catch (error) {
    console.error('Error listing folders:', error);
    throw new Error('Failed to list folders');
  }
};

/**
 * Search folders by name
 */
export const searchFolders = async (
  accessToken: string,
  query: string
): Promise<Folder[]> => {
  try {
    const response = await axios.get<ListFilesResponse>(`${DRIVE_API_BASE}/files`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: `mimeType='${MIME_TYPES.FOLDER}' and name contains '${query}' and trashed=false`,
        fields: 'files(id, name, createdTime, modifiedTime, webViewLink, iconLink)',
        pageSize: 50,
      },
    });

    return response.data.files as Folder[];
  } catch (error) {
    console.error('Error searching folders:', error);
    throw new Error('Failed to search folders');
  }
};

/**
 * Create a new folder in Google Drive
 */
export const createFolder = async (
  accessToken: string,
  folderName: string,
  parentId?: string
): Promise<Folder> => {
  try {
    const metadata: { name: string; mimeType: string; parents?: string[] } = {
      name: folderName,
      mimeType: MIME_TYPES.FOLDER,
    };

    if (parentId) {
      metadata.parents = [parentId];
    }

    const response = await axios.post<Folder>(
      `${DRIVE_API_BASE}/files`,
      metadata,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          fields: 'id, name, createdTime, modifiedTime, webViewLink, iconLink',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw new Error('Failed to create folder');
  }
};

/**
 * List files in a specific folder
 */
export const listFiles = async (
  accessToken: string,
  folderId: string,
  pageSize: number = 100
): Promise<GoogleDriveFile[]> => {
  try {
    const query = `'${folderId}' in parents and mimeType!='${MIME_TYPES.FOLDER}' and trashed=false`;

    const response = await axios.get<ListFilesResponse>(`${DRIVE_API_BASE}/files`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: query,
        fields: 'files(id, name, mimeType, createdTime, modifiedTime, size, webViewLink, thumbnailLink)',
        pageSize,
        orderBy: 'modifiedTime desc',
      },
    });

    return response.data.files as GoogleDriveFile[];
  } catch (error) {
    console.error('Error listing files:', error);
    throw new Error('Failed to list files');
  }
};

/**
 * Upload a file to Google Drive
 */
export const uploadFile = async (
  accessToken: string,
  params: UploadFileParams,
  onProgress?: (progress: number) => void
): Promise<GoogleDriveFile> => {
  try {
    const { file, folderId, fileName } = params;

    // Create metadata
    const metadata = {
      name: fileName,
      mimeType: file.type,
      parents: [folderId],
    };

    // Create form data for multipart upload
    const formData = new FormData();
    formData.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    formData.append('file', file);

    const response = await axios.post<GoogleDriveFile>(
      `${DRIVE_UPLOAD_API}/files?uploadType=multipart`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          fields: 'id, name, mimeType, createdTime, modifiedTime, size, webViewLink',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};

/**
 * Get files in a folder
 */
export const getFilesInFolder = async (
  accessToken: string,
  folderId: string
): Promise<GoogleDriveFile[]> => {
  try {
    const response = await axios.get<ListFilesResponse>(`${DRIVE_API_BASE}/files`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id, name, mimeType, createdTime, modifiedTime, size, webViewLink, iconLink)',
        pageSize: 100,
        orderBy: 'modifiedTime desc',
      },
    });

    return response.data.files;
  } catch (error) {
    console.error('Error getting files in folder:', error);
    throw new Error('Failed to get files in folder');
  }
};

/**
 * Get folder by ID
 */
export const getFolderById = async (
  accessToken: string,
  folderId: string
): Promise<Folder> => {
  try {
    const response = await axios.get<Folder>(`${DRIVE_API_BASE}/files/${folderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        fields: 'id, name, createdTime, modifiedTime, webViewLink, iconLink',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error getting folder:', error);
    throw new Error('Failed to get folder');
  }
};
