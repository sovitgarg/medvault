import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useDrive } from '../hooks/useDrive';
import { useAuthContext } from './AuthContext';
import type { Folder, GoogleDriveFile } from '../types';

interface DriveContextType {
  folders: Folder[];
  files: GoogleDriveFile[];
  loading: boolean;
  error: string | null;
  fetchFolders: (parentFolderId?: string) => Promise<void>;
  searchFolders: (query: string) => Promise<void>;
  createFolder: (folderName: string, parentFolderId?: string) => Promise<Folder | null>;
  moveFile: (fileId: string, currentParentId: string, newParentId: string) => Promise<GoogleDriveFile | null>;
  deleteFile: (fileId: string) => Promise<boolean>;
}

const DriveContext = createContext<DriveContextType | undefined>(undefined);

export const DriveProvider = ({ children }: { children: ReactNode }) => {
  const { accessToken, isAuthenticated, logout } = useAuthContext();
  const drive = useDrive(accessToken, logout);

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
