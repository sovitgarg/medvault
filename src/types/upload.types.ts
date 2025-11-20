export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface CapturedImage {
  file: File;
  preview: string;
  timestamp: number;
}

export interface UploadFormData {
  fileName: string;
  folderId: string;
  file: File;
}
