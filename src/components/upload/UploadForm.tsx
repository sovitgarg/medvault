import { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useUpload } from '../../hooks/useUpload';
import { useAuthContext } from '../../context/AuthContext';
import { useDriveContext } from '../../context/DriveContext';
import type { Folder } from '../../types';

interface UploadFormProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: string;
  currentFolderId?: string;
  currentFolder?: Folder | null;
  folderPath?: Folder[];
}

export const UploadForm = ({ isOpen, onClose, folderId, currentFolderId, folderPath }: UploadFormProps) => {
  const { accessToken, logout } = useAuthContext();
  const { fetchFolders } = useDriveContext();
  const { upload, uploadProgress } = useUpload(accessToken, logout);

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Build the folder path string
  const getFolderPathString = () => {
    if (!folderPath || folderPath.length === 0) {
      return 'Home';
    }
    return 'Home / ' + folderPath.map(f => f.name).join(' / ');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);

      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !folderId) return;

    const success = await upload({
      file,
      folderId: folderId,
      fileName,
    });

    if (success) {
      // Refresh the current folder we're viewing in the Dashboard
      await fetchFolders(currentFolderId);
      setFile(null);
      setFileName('');
      setPreview(null);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload File">
      <div className="space-y-4">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/*,.pdf"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="secondary"
            className="w-full"
          >
            📁 Select File
          </Button>
        </div>

        {file && (
          <>
            {preview && (
              <img src={preview} alt="Preview" className="w-full rounded-lg max-h-64 object-contain" />
            )}

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

            {uploadProgress.status === 'uploading' && (
              <div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1 text-center">
                  {uploadProgress.progress}%
                </p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              className="w-full"
              disabled={!fileName || !folderId}
              loading={uploadProgress.status === 'uploading'}
            >
              Upload to Drive
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};
