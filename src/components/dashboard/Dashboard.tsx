import { useState, useEffect } from 'react';
import { Header } from '../common/Header';
import { FolderGrid } from './FolderGrid';
import { SearchBar } from './SearchBar';
import { useDriveContext } from '../../context/DriveContext';
import { Loading } from '../common/Loading';
import { CreateFolderModal } from '../folder/CreateFolderModal';
import { UploadForm } from '../upload/UploadForm';
import { CameraCapture } from '../upload/CameraCapture';
import type { Folder } from '../../types';

export const Dashboard = () => {
  const { folders, loading, fetchFolders } = useDriveContext();
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [folderPath, setFolderPath] = useState<Folder[]>([]);

  useEffect(() => {
    fetchFolders(currentFolder?.id);
  }, [currentFolder]);

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
        {/* Breadcrumb Navigation */}
        {folderPath.length > 0 && (
          <div className="mb-6 flex items-center space-x-2 text-sm">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-blue-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center space-x-2 text-gray-600">
              <button onClick={() => handleBreadcrumbClick(-1)} className="hover:text-blue-600 font-medium">
                Home
              </button>
              {folderPath.map((folder, index) => (
                <div key={folder.id} className="flex items-center space-x-2">
                  <span>/</span>
                  <button
                    onClick={() => handleBreadcrumbClick(index)}
                    className="hover:text-blue-600 font-medium"
                  >
                    {folder.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Actions Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              {currentFolder ? currentFolder.name : 'My Folders'}
            </h2>
            <p className="text-sm text-gray-600">
              {currentFolder
                ? 'Files and folders in this location'
                : 'Manage your medical documents and files'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateFolder(true)}
              className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-medium"
            >
              <span className="text-xl">📁</span>
              <span>New Folder</span>
            </button>
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-medium"
            >
              <span className="text-xl">📤</span>
              <span>Upload</span>
            </button>
            <button
              onClick={() => setShowCamera(true)}
              className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-medium"
            >
              <span className="text-xl">📸</span>
              <span>Camera</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Folder Grid */}
        <FolderGrid folders={folders} loading={loading} onFolderClick={handleFolderClick} />
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
        />
      )}

      {showCamera && (
        <CameraCapture
          isOpen={showCamera}
          onClose={() => setShowCamera(false)}
          folderId={currentFolder?.id}
        />
      )}
    </div>
  );
};
