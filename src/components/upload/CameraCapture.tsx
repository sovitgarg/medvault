import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useCamera } from '../../hooks/useCamera';
import { useUpload } from '../../hooks/useUpload';
import { useAuthContext } from '../../context/AuthContext';
import { useDriveContext } from '../../context/DriveContext';
import { generateFileName } from '../../utils/fileHelpers';
import type { Folder } from '../../types';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: string;
  currentFolderId?: string;
  currentFolder?: Folder | null;
  folderPath?: Folder[];
}

export const CameraCapture = ({ isOpen, onClose, folderId, currentFolderId, folderPath }: CameraCaptureProps) => {
  const { accessToken, logout } = useAuthContext();
  const { fetchFolders } = useDriveContext();
  const { videoRef, capturedImage, isActive, startCamera, stopCamera, capturePhoto, clearCapturedImage } = useCamera();
  const { upload, uploadProgress } = useUpload(accessToken, logout);

  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (isOpen) {
      startCamera();
      setFileName(generateFileName('photo'));
    } else {
      stopCamera();
      clearCapturedImage();
    }
  }, [isOpen, folderId]);

  // Build the folder path string
  const getFolderPathString = () => {
    if (!folderPath || folderPath.length === 0) {
      return 'Home';
    }
    return 'Home / ' + folderPath.map(f => f.name).join(' / ');
  };

  const handleCapture = async () => {
    await capturePhoto();
  };

  const handleUpload = async () => {
    if (!capturedImage || !folderId) return;

    const success = await upload({
      file: capturedImage.file,
      folderId: folderId,
      fileName,
    });

    if (success) {
      // Refresh the current folder we're viewing in the Dashboard
      await fetchFolders(currentFolderId);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Camera Capture">
      <div className="space-y-4">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg bg-black"
            />
            <Button onClick={handleCapture} className="w-full" disabled={!isActive}>
              📸 Capture Photo
            </Button>
          </>
        ) : (
          <>
            <img
              src={capturedImage.preview}
              alt="Captured"
              className="w-full rounded-lg"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File Name
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Uploading to:
              </label>
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                📁 {getFolderPathString()}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => clearCapturedImage()}
                variant="secondary"
                className="flex-1"
              >
                Retake
              </Button>
              <Button
                onClick={handleUpload}
                className="flex-1"
                disabled={!fileName || !folderId}
                loading={uploadProgress.status === 'uploading'}
              >
                Upload
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
