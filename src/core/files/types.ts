export type FileInfo = {
  id: number;
  url: string;
};

export type BaseFileInfo = {
  id: number;
  fileUrl: string;
  name: string | null;
  deleted: string | null;
};
