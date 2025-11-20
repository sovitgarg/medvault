import { GoogleDriveFile } from '../../types';
import { formatFileSize, formatDate } from '../../utils/formatters';

interface FileCardProps {
  file: GoogleDriveFile;
  onClick: (file: GoogleDriveFile) => void;
}

export const FileCard = ({ file, onClick }: FileCardProps) => {
  const isImage = file.mimeType?.startsWith('image/');
  const isPdf = file.mimeType === 'application/pdf';

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
        {isImage && file.thumbnailLink ? (
          <img
            src={file.thumbnailLink}
            alt={file.name}
            className="w-full h-full object-cover"
          />
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
