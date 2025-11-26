import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { listFolders } from '../../services/googleDrive';
import type { Folder } from '../../types';

interface MoveFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedItems: Set<string>;
    currentFolderId?: string;
    onMoveComplete: () => void;
    moveFile: (fileId: string, currentParentId: string, newParentId: string) => Promise<any>;
}

export const MoveFileModal = ({
    isOpen,
    onClose,
    selectedItems,
    currentFolderId,
    onMoveComplete,
    moveFile,
}: MoveFileModalProps) => {
    const { accessToken } = useAuthContext();
    const [modalFolders, setModalFolders] = useState<Folder[]>([]);
    const [loading, setLoading] = useState(false);
    const [destinationFolderId, setDestinationFolderId] = useState<string | undefined>(undefined);
    const [folderPath, setFolderPath] = useState<Folder[]>([]);
    const [isMoving, setIsMoving] = useState(false);

    const fetchModalFolders = async (parentId?: string) => {
        if (!accessToken) return;

        setLoading(true);
        try {
            const folders = await listFolders(accessToken, parentId);
            setModalFolders(folders);
        } catch (error) {
            console.error('Error fetching folders:', error);
            setModalFolders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Start at root
            fetchModalFolders(undefined);
            setDestinationFolderId(undefined);
            setFolderPath([]);
        }
    }, [isOpen]);

    const handleFolderClick = (folder: Folder) => {
        setFolderPath([...folderPath, folder]);
        setDestinationFolderId(folder.id);
        fetchModalFolders(folder.id);
    };

    const handleBack = () => {
        const newPath = [...folderPath];
        newPath.pop();
        setFolderPath(newPath);
        const newDestination = newPath[newPath.length - 1]?.id;
        setDestinationFolderId(newDestination);
        fetchModalFolders(newDestination);
    };

    const handleMove = async () => {
        if (!currentFolderId) return;

        setIsMoving(true);
        try {
            const targetFolderId = destinationFolderId || 'root';

            // Move all selected items
            for (const itemId of selectedItems) {
                await moveFile(itemId, currentFolderId, targetFolderId);
            }

            onMoveComplete();
            onClose();
        } catch (error) {
            console.error('Error moving files:', error);
            alert('Failed to move files. Please try again.');
        } finally {
            setIsMoving(false);
        }
    };

    const canMoveHere = destinationFolderId !== currentFolderId;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Move {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Select a destination folder</p>
                </div>

                {/* Breadcrumb */}
                <div className="px-6 py-3 border-b border-gray-100 flex items-center space-x-2 text-sm">
                    <button
                        onClick={() => {
                            setFolderPath([]);
                            setDestinationFolderId(undefined);
                            fetchModalFolders(undefined);
                        }}
                        className="font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        Home
                    </button>
                    {folderPath.map((folder, index) => (
                        <div key={folder.id} className="flex items-center space-x-2">
                            <span className="text-gray-400">/</span>
                            <button
                                onClick={() => {
                                    const newPath = folderPath.slice(0, index + 1);
                                    setFolderPath(newPath);
                                    setDestinationFolderId(folder.id);
                                    fetchModalFolders(folder.id);
                                }}
                                className="font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                {folder.name}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Folder List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : modalFolders.length === 0 ? (
                        <div className="text-center py-12">
                            <span className="text-4xl">📁</span>
                            <p className="text-gray-500 mt-2">No folders here</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {modalFolders.map((folder) => (
                                <button
                                    key={folder.id}
                                    onClick={() => handleFolderClick(folder)}
                                    disabled={selectedItems.has(folder.id)}
                                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="text-2xl">📁</span>
                                    <span className="flex-1 text-left font-medium text-gray-900">
                                        {folder.name}
                                    </span>
                                    <svg
                                        className="w-5 h-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={folderPath.length === 0}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ← Back
                    </button>
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            disabled={isMoving}
                            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleMove}
                            disabled={!canMoveHere || isMoving}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isMoving ? 'Moving...' : `Move Here`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
