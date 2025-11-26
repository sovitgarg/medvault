import type { GoogleDriveFile } from '../../types';
import { FileCard } from './FileCard';

interface FileGridProps {
  files: GoogleDriveFile[];
  loading: boolean;
  onFileClick: (file: GoogleDriveFile) => void;
  selectionMode?: boolean;
  selectedItems?: Set<string>;
}

export const FileGrid = ({ files, loading, onFileClick, selectionMode = false, selectedItems = new Set() }: FileGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm p-4 animate-pulse"
          >
            <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <span className="text-3xl">📄</span>
        </div>
        <p className="text-gray-500 text-lg">No files in this folder</p>
        <p className="text-gray-400 text-sm mt-1">Upload files to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onClick={onFileClick}
          selectionMode={selectionMode}
          isSelected={selectedItems.has(file.id)}
        />
      ))}
    </div>
  );
};
