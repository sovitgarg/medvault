import { useState, useEffect } from 'react';
import type { GoogleDriveFile } from '../../types';
import { formatFileSize, formatDate } from '../../utils/formatters';

interface FileCardProps {
  file: GoogleDriveFile;
  onClick: (file: GoogleDriveFile) => void;
  selectionMode?: boolean;
  isSelected?: boolean;
}

export const FileCard = ({ file, onClick, selectionMode = false, isSelected = false }: FileCardProps) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  // Check if file is an image by mimeType or extension (for HEIC, etc.)
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif', '.bmp'];
  const isImageByExtension = imageExtensions.some(ext =>
    file.name?.toLowerCase().endsWith(ext)
  );
  const isImage = file.mimeType?.startsWith('image/') || isImageByExtension;
  const isPdf = file.mimeType === 'application/pdf';

  useEffect(() => {
    // Reset state when file changes
    setHasError(false);

    if (file.thumbnailLink) {
      setImgSrc(file.thumbnailLink);
    } else if (file.iconLink) {
      setImgSrc(file.iconLink.replace('16', '128'));
    } else {
      setImgSrc(null);
    }
  }, [file]);

  const handleError = () => {
    if (imgSrc === file.thumbnailLink && file.iconLink) {
      // If thumbnail failed, try icon
      setImgSrc(file.iconLink.replace('16', '128'));
    } else {
      // If icon also failed (or we were already using it), show placeholder
      setHasError(true);
    }
  };

  const handleClick = () => {
    onClick(file);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 cursor-pointer border hover:scale-105 ${isSelected ? 'border-blue-500 border-2' : 'border-gray-100 hover:border-blue-200'
        }`}
    >
      {/* Selection Checkbox Overlay */}
      {selectionMode && (
        <div className="absolute top-2 right-2 z-10">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
            ? 'bg-blue-600 border-blue-600'
            : 'bg-white border-gray-400'
            }`}>
            {isSelected && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
      )}
      {/* Thumbnail */}
      <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        {imgSrc && !hasError ? (
          <img
            src={imgSrc}
            alt={file.name}
            className="w-full h-full object-cover"
            onError={handleError}
            referrerPolicy="no-referrer"
          />
        ) : isImage ? (
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
