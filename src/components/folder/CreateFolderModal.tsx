import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useDriveContext } from '../../context/DriveContext';
import { validateFolderName } from '../../utils/validators';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentFolderId?: string;
}

export const CreateFolderModal = ({ isOpen, onClose, parentFolderId }: CreateFolderModalProps) => {
  const { createFolder } = useDriveContext();
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    const validation = validateFolderName(folderName);
    if (!validation.valid) {
      setError(validation.error || 'Invalid folder name');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);
      await createFolder(folderName, parentFolderId);
      setFolderName('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create folder');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Folder">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Folder Name
          </label>
          <input
            type="text"
            value={folderName}
            onChange={(e) => {
              setFolderName(e.target.value);
              setError(null);
            }}
            placeholder="Enter folder name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1"
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            className="flex-1"
            disabled={!folderName.trim()}
            loading={isCreating}
          >
            Create
          </Button>
        </div>
      </div>
    </Modal>
  );
};
