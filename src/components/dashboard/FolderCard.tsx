import { formatDate } from '../../utils/formatters';
import type { Folder } from '../../types';

interface FolderCardProps {
  folder: Folder;
  onClick: (folder: Folder) => void;
}

export const FolderCard = ({ folder, onClick }: FolderCardProps) => {
  const handleClick = () => {
    onClick(folder);
  };

  const handleOpenInDrive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (folder.webViewLink) {
      window.open(folder.webViewLink, '_blank');
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-blue-200 hover:scale-105"
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg">
          <svg
            className="h-8 w-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {folder.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(folder.modifiedTime)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-sm text-gray-600 font-medium">Click to open</span>
        <button
          onClick={handleOpenInDrive}
          className="text-sm text-blue-600 font-medium flex items-center space-x-1 hover:text-blue-700"
        >
          <span>View in Drive</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </div>
    </div>
  );
};
