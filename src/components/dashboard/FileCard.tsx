import { useState, useEffect } from 'react';
import type { GoogleDriveFile } from '../../types';
import { formatFileSize, formatDate } from '../../utils/formatters';
import { useAuthContext } from '../../context/AuthContext';

interface FileCardProps {
  file: GoogleDriveFile;
  onClick: (file: GoogleDriveFile) => void;
}

export const FileCard = ({ file, onClick }: FileCardProps) => {
  const { accessToken } = useAuthContext();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const isImage = file.mimeType?.startsWith('image/');
  const isPdf = file.mimeType === 'application/pdf';

  // Fetch authenticated thumbnail using Google Drive API
  useEffect(() => {
    if (isImage && accessToken && !imageError && file.id) {
      const fetchThumbnail = async () => {
        try {
          // Use Google Drive API to get file content with alt=media
          const url = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (response.ok) {
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            setThumbnailUrl(objectUrl);
          } else {
            console.error('Failed to fetch image:', response.status);
            setImageError(true);
          }
        } catch (error) {
          console.error('Failed to fetch thumbnail:', error);
          setImageError(true);
        }
      };
      fetchThumbnail();
    }

    return () => {
      if (thumbnailUrl) {
        URL.revokeObjectURL(thumbnailUrl);
      }
    };
  }, [isImage, file.id, accessToken, imageError]);

  const handleClick = () => {
    onClick(file);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 cursor-pointer border border-gray-100 hover:border-blue-200 hover:scale-105"
    >
      {/* Thumbnail */}
      <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        {isImage && thumbnailUrl && !imageError ? (
          <img
            src={thumbnailUrl}
            alt={file.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : isImage && !thumbnailUrl && !imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-blue-50">
            <span className="text-5xl">🖼️</span>
          </div>
        ) : isPdf ? (
          <div className="w-full h-full flex items-center justify-center bg-red-50">
            <span className="text-5xl">📄</span>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <span className="text-5xl">📎</span>
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
          {file.name}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-500">
          {file.size && <span>{formatFileSize(Number(file.size))}</span>}
          {file.modifiedTime && <span>{formatDate(file.modifiedTime)}</span>}
        </div>
      </div>
    </div>
  );
};
