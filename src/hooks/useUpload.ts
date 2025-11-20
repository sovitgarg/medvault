import { useState, useCallback } from 'react';
import { uploadFile } from '../services/googleDrive';
import type { UploadProgress, UploadFileParams } from '../types';

const isAuthError = (error: any): boolean => {
  return error?.response?.status === 401 ||
         error?.message?.includes('401') ||
         error?.message?.includes('unauthorized') ||
         error?.message?.includes('invalid_token');
};

export const useUpload = (accessToken: string | null, onAuthError?: () => void) => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    fileName: '',
    progress: 0,
    status: 'idle',
  });

  const upload = useCallback(
    async (params: UploadFileParams): Promise<boolean> => {
      if (!accessToken) {
        setUploadProgress({
          fileName: params.fileName,
          progress: 0,
          status: 'error',
          error: 'Not authenticated',
        });
        return false;
      }

      try {
        setUploadProgress({
          fileName: params.fileName,
          progress: 0,
          status: 'uploading',
        });

        await uploadFile(accessToken, params, (progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            progress,
          }));
        });

        setUploadProgress({
          fileName: params.fileName,
          progress: 100,
          status: 'success',
        });

        return true;
      } catch (err) {
        console.error('Upload error:', err);
        if (isAuthError(err)) {
          console.log('Auth error detected during upload, logging out...');
          onAuthError?.();
        }
        setUploadProgress({
          fileName: params.fileName,
          progress: 0,
          status: 'error',
          error: err instanceof Error ? err.message : 'Upload failed',
        });
        return false;
      }
    },
    [accessToken, onAuthError]
  );

  const resetProgress = useCallback(() => {
    setUploadProgress({
      fileName: '',
      progress: 0,
      status: 'idle',
    });
  }, []);

  return {
    uploadProgress,
    upload,
    resetProgress,
  };
};
