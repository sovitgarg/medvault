import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useCamera } from '../../hooks/useCamera';
import { useUpload } from '../../hooks/useUpload';
import { useAuthContext } from '../../context/AuthContext';
import { useDriveContext } from '../../context/DriveContext';
import { generateFileName } from '../../utils/fileHelpers';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: string;
}

export const CameraCapture = ({ isOpen, onClose, folderId }: CameraCaptureProps) => {
  const { accessToken } = useAuthContext();
  const { folders, fetchFolders } = useDriveContext();
  const { videoRef, capturedImage, isActive, startCamera, stopCamera, capturePhoto, clearCapturedImage } = useCamera();
  const { upload, uploadProgress } = useUpload(accessToken);

  const [fileName, setFileName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(folderId || '');

  useEffect(() => {
    if (isOpen) {
      startCamera();
      setFileName(generateFileName('photo'));
    } else {
      stopCamera();
      clearCapturedImage();
    }
  }, [isOpen]);

  const handleCapture = async () => {
    await capturePhoto();
  };

  const handleUpload = async () => {
    if (!capturedImage || !selectedFolder) return;

    const success = await upload({
      file: capturedImage.file,
      folderId: selectedFolder,
      fileName,
    });

    if (success) {
      await fetchFolders();
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
                Select Folder
              </label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a folder</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
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
                disabled={!fileName || !selectedFolder}
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
