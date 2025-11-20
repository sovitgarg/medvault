import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useDrive } from '../hooks/useDrive';
import { useAuthContext } from './AuthContext';
import type { Folder } from '../types';

interface DriveContextType {
  folders: Folder[];
  loading: boolean;
  error: string | null;
  fetchFolders: (parentFolderId?: string) => Promise<void>;
  searchFolders: (query: string) => Promise<void>;
  createFolder: (folderName: string, parentFolderId?: string) => Promise<Folder | null>;
}

const DriveContext = createContext<DriveContextType | undefined>(undefined);

export const DriveProvider = ({ children }: { children: ReactNode }) => {
  const { accessToken, isAuthenticated } = useAuthContext();
  const drive = useDrive(accessToken);

  // Auto-fetch folders when authenticated
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      drive.fetchFolders();
    }
  }, [isAuthenticated, accessToken]);

  return <DriveContext.Provider value={drive}>{children}</DriveContext.Provider>;
};

export const useDriveContext = () => {
  const context = useContext(DriveContext);
  if (!context) {
    throw new Error('useDriveContext must be used within DriveProvider');
  }
  return context;
};
