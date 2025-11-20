import { useState, useCallback } from 'react';
import { uploadFile } from '../services/googleDrive';
import type { UploadProgress, UploadFileParams } from '../types';

export const useUpload = (accessToken: string | null) => {
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
        setUploadProgress({
          fileName: params.fileName,
          progress: 0,
          status: 'error',
          error: err instanceof Error ? err.message : 'Upload failed',
        });
        return false;
      }
    },
    [accessToken]
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
