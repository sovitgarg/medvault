import { useState, useCallback } from 'react';
import {
  listFolders,
  searchFolders as searchDriveFolders,
  createFolder as createDriveFolder,
} from '../services/googleDrive';
import type { Folder } from '../types';

export const useDrive = (accessToken: string | null) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = useCallback(async (parentFolderId?: string) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedFolders = await listFolders(accessToken, parentFolderId);
      setFolders(fetchedFolders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch folders');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const searchFolders = useCallback(
    async (query: string) => {
      if (!accessToken) return;

      try {
        setLoading(true);
        setError(null);
        const results = await searchDriveFolders(accessToken, query);
        setFolders(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search folders');
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
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
        setError(err instanceof Error ? err.message : 'Failed to create folder');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  return {
    folders,
    loading,
    error,
    fetchFolders,
    searchFolders,
    createFolder,
  };
};
