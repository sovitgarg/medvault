import { FolderCard } from './FolderCard';
import type { Folder } from '../../types';

interface FolderGridProps {
  folders: Folder[];
  loading: boolean;
  onFolderClick: (folder: Folder) => void;
  selectionMode?: boolean;
  selectedItems?: Set<string>;
}

export const FolderGrid = ({ folders, loading, onFolderClick, selectionMode = false, selectedItems = new Set() }: FolderGridProps) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading folders...</p>
      </div>
    );
  }

  if (folders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No folders</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new folder.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          folder={folder}
          onClick={onFolderClick}
          selectionMode={selectionMode}
          isSelected={selectedItems.has(folder.id)}
        />
      ))}
    </div>
  );
};
