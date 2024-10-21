import { AxiosProgressEvent, AxiosRequestConfig, AxiosResponse } from 'axios';
import { createEffect } from 'effector';
import { AXPOSTER } from '../data/fetcher';
import { FileInfo } from './types';

type ParamsConfig = {
  file: File;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
};

export const uploadFileFX = createEffect(async (config: ParamsConfig) => {
  const fileInfo = await fileUploadOnDrop(config);

  return fileInfo;
});
export const deleteFileFX = createEffect(async (fileId: number) => {
  await AXPOSTER.delete(`/admin/api/filestorage/file/${fileId}`);
});

const fileUploadOnDrop = async ({ file, onUploadProgress }: ParamsConfig) => {
  const formData = new FormData();
  formData.append('file', file);

  const axTarget: (
    url: string,
    data?: FormData,
    config?: AxiosRequestConfig | undefined,
  ) => Promise<AxiosResponse<FileInfo>> = AXPOSTER.post<FileInfo>;

  const { data } = await axTarget(`/admin/api/filestorage/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });

  return data;
};
