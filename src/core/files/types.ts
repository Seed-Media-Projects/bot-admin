export type FileInfo = {
  id: number;
  url: string;
  fileType: FileType;
  fileName: string;
  privacyView: FilePrivacyView | null;
};

export type BaseFileInfo = {
  id: number;
  fileUrl: string;
  name: string | null;
  deleted: string | null;
};

export type FileType = 'img' | 'video';
export type FilePrivacyView = 'all' | 'members';
