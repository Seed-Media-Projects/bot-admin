export type FileInfo = {
  id: number;
  url: string;
  fileType: 'img' | 'video';
  fileName: string;
  privacyView: 'all' | 'members' | null;
};

export type BaseFileInfo = {
  id: number;
  fileUrl: string;
  name: string | null;
  deleted: string | null;
};
