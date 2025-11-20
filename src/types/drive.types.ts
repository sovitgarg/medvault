export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  modifiedTime: string;
  size?: string;
  webViewLink?: string;
  iconLink?: string;
  parents?: string[];
}

export interface Folder extends GoogleDriveFile {
  fileCount?: number;
}

export interface FileMetadata {
  name: string;
  mimeType: string;
  parents?: string[];
}

export interface ListFilesResponse {
  files: GoogleDriveFile[];
  nextPageToken?: string;
}

export interface UploadFileParams {
  file: File;
  folderId: string;
  fileName: string;
}
