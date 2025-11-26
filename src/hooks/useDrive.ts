import { useState, useCallback } from 'react';
import {
  listFolders,
  listFiles,
  searchFolders as searchDriveFolders,
  createFolder as createDriveFolder,
  moveFile as moveDriveFile,
  deleteFile as deleteDriveFile,
} from '../services/googleDrive';
import type { Folder, GoogleDriveFile } from '../types';

const isAuthError = (error: any): boolean => {
  return error?.response?.status === 401 ||
    error?.message?.includes('401') ||
    error?.message?.includes('unauthorized') ||
    error?.message?.includes('invalid_token');
};

export const useDrive = (accessToken: string | null, onAuthError?: () => void) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = useCallback(async (parentFolderId?: string) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedFolders = await listFolders(accessToken, parentFolderId);
      setFolders(fetchedFolders);

      // Fetch files if inside a folder
      if (parentFolderId) {
        const fetchedFiles = await listFiles(accessToken, parentFolderId);
        setFiles(fetchedFiles);
      } else {
        setFiles([]);
      }
    } catch (err) {
      console.error('Error fetching folders:', err);
      if (isAuthError(err)) {
        console.log('Auth error detected, logging out...');
        onAuthError?.();
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch folders');
    } finally {
      setLoading(false);
    }
  }, [accessToken, onAuthError]);

  const searchFolders = useCallback(
    async (query: string) => {
      if (!accessToken) return;

      try {
        setLoading(true);
        setError(null);
        const results = await searchDriveFolders(accessToken, query);
        setFolders(results);
      } catch (err) {
        console.error('Error searching folders:', err);
        if (isAuthError(err)) {
          console.log('Auth error detected, logging out...');
          onAuthError?.();
        }
        setError(err instanceof Error ? err.message : 'Failed to search folders');
      } finally {
        setLoading(false);
      }
    },
    [accessToken, onAuthError]
  );

  const createFolder = useCallback(
    async (folderName: string, parentFolderId?: string): Promise<Folder | null> => {
      if (!accessToken) return null;

      try {
        setLoading(true);
        setError(null);
        const newFolder = await createDriveFolder(accessToken, folderName, parentFolderId);
        setFolders((prev) => [newFolder, ...prev]);
        return newFolder;
      } catch (err) {
        console.error('Error creating folder:', err);
        if (isAuthError(err)) {
          console.log('Auth error detected, logging out...');
          onAuthError?.();
        }
        setError(err instanceof Error ? err.message : 'Failed to create folder');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [accessToken, onAuthError]
  );

  const moveFile = useCallback(
    async (fileId: string, currentParentId: string, newParentId: string): Promise<GoogleDriveFile | null> => {
      if (!accessToken) return null;

      try {
        setLoading(true);
        setError(null);
        const movedFile = await moveDriveFile(accessToken, fileId, currentParentId, newParentId);

        // Update local state
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        setFolders((prev) => prev.filter((f) => f.id !== fileId));

        return movedFile;
      } catch (err) {
        console.error('Error moving file:', err);
        if (isAuthError(err)) {
          console.log('Auth error detected, logging out...');
          onAuthError?.();
        }
        setError(err instanceof Error ? err.message : 'Failed to move file');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [accessToken, onAuthError]
  );

  const deleteFile = useCallback(
    async (fileId: string): Promise<boolean> => {
      if (!accessToken) return false;

      try {
        setLoading(true);
        setError(null);
        await deleteDriveFile(accessToken, fileId);

        // Update local state
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        setFolders((prev) => prev.filter((f) => f.id !== fileId));

        return true;
      } catch (err) {
        console.error('Error deleting file:', err);
        if (isAuthError(err)) {
          console.log('Auth error detected, logging out...');
          onAuthError?.();
        }
        setError(err instanceof Error ? err.message : 'Failed to delete file');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [accessToken, onAuthError]
  );

  return {
    folders,
    files,
    loading,
    error,
    fetchFolders,
    searchFolders,
    createFolder,
    moveFile,
    deleteFile,
  };
};
