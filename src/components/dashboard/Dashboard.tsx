import { useState, useEffect, useMemo } from 'react';
import { Header } from '../common/Header';
import { FolderGrid } from './FolderGrid';
import { FileGrid } from './FileGrid';
import { SearchBar } from './SearchBar';
import { useDriveContext } from '../../context/DriveContext';
import { Loading } from '../common/Loading';
import { CreateFolderModal } from '../folder/CreateFolderModal';
import { UploadForm } from '../upload/UploadForm';
import { CameraCapture } from '../upload/CameraCapture';
import type { Folder } from '../../types';

export const Dashboard = () => {
  const { folders, files, loading, fetchFolders } = useDriveContext();
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [folderPath, setFolderPath] = useState<Folder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFolders(currentFolder?.id);
  }, [currentFolder]);

  // Filter folders and files based on search query
  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return folders;
    return folders.filter(folder =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [folders, searchQuery]);

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    return files.filter(file =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [files, searchQuery]);

  if (loading && folders.length === 0) {
    return <Loading />;
  }

  const handleFolderClick = (folder: Folder) => {
    setFolderPath([...folderPath, folder]);
    setCurrentFolder(folder);
  };

  const handleBack = () => {
    const newPath = [...folderPath];
    newPath.pop();
    setFolderPath(newPath);
    setCurrentFolder(newPath[newPath.length - 1] || null);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      // Root
      setFolderPath([]);
      setCurrentFolder(null);
    } else {
      const newPath = folderPath.slice(0, index + 1);
      setFolderPath(newPath);
      setCurrentFolder(newPath[newPath.length - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Actions Bar with Navigation */}
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {folderPath.length > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>
            )}
            <div className="flex items-center space-x-2 text-base">
              <button onClick={() => handleBreadcrumbClick(-1)} className="font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </button>
              {folderPath.map((folder, index) => (
                <div key={folder.id} className="flex items-center space-x-2">
                  <span className="text-gray-400">/</span>
                  <button
                    onClick={() => handleBreadcrumbClick(index)}
                    className="font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {folder.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowCreateFolder(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-medium text-sm"
            >
              <span className="text-lg">📁</span>
              <span>New Folder</span>
            </button>
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-medium text-sm"
            >
              <span className="text-lg">📤</span>
              <span>Upload</span>
            </button>
            <button
              onClick={() => setShowCamera(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-medium text-sm"
            >
              <span className="text-lg">📸</span>
              <span>Camera</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Folder Grid */}
        {filteredFolders.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Folders</h3>
            <FolderGrid folders={filteredFolders} loading={loading} onFolderClick={handleFolderClick} />
          </div>
        )}

        {/* File Grid - Only show when inside a folder */}
        {currentFolder && filteredFiles.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Files</h3>
            <FileGrid
              files={filteredFiles}
              loading={loading}
              onFileClick={(file) => {
                if (file.webViewLink) {
                  window.open(file.webViewLink, '_blank');
                }
              }}
            />
          </div>
        )}

        {/* Empty state when no results */}
        {!loading && filteredFolders.length === 0 && filteredFiles.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <p className="text-gray-500 text-lg">No results found for "{searchQuery}"</p>
            <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </main>

      {showCreateFolder && (
        <CreateFolderModal
          isOpen={showCreateFolder}
          onClose={() => setShowCreateFolder(false)}
          parentFolderId={currentFolder?.id}
          onFolderCreated={(newFolder) => {
            setFolderPath([...folderPath, newFolder]);
            setCurrentFolder(newFolder);
          }}
        />
      )}

      {showUpload && (
        <UploadForm
          isOpen={showUpload}
          onClose={() => setShowUpload(false)}
          folderId={currentFolder?.id}
          currentFolderId={currentFolder?.id}
        />
      )}

      {showCamera && (
        <CameraCapture
          isOpen={showCamera}
          onClose={() => setShowCamera(false)}
          folderId={currentFolder?.id}
          currentFolderId={currentFolder?.id}
        />
      )}
    </div>
  );
};
