import { useUnit } from 'effector-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { showSnack } from '../snacks/store';
import { uploadFileFX } from './api';
import { FileInfo } from './types';

const oneMB = 1048576;

export const useUploader = ({
  onFinishUpload,
  onFinishUploadAll,
  maxFiles = 10,
}: {
  onFinishUpload?: (f: FileInfo) => void;
  onFinishUploadAll?: (files: FileInfo[]) => void;
  maxFiles?: number;
}) => {
  const loading = useUnit(uploadFileFX.pending);
  const [progress, setProgress] = useState<Record<string, number>>({});

  const uploadFn = async (file: File) => {
    const data = await uploadFileFX({
      file,
      onUploadProgress: p => {
        setProgress({
          ...progress,
          [file.name]: Math.round((p.loaded * 100) / (p.total ?? 0)),
        });
      },
    });
    const prgs = progress;
    delete prgs[file.name];
    setProgress(prgs);
    onFinishUpload?.(data);

    return data;
  };

  const { open, getInputProps } = useDropzone({
    accept: {
      'image/png': [],
      'image/webp': [],
      'image/jpeg': [],
      'image/jpg': [],
      'image/gif': [],
      'video/mp4': [],
    },
    maxSize: oneMB * 50,
    disabled: loading,
    maxFiles,
    multiple: maxFiles > 1,
    onDrop: async (acceptedFiles: File[]) => {
      try {
        const allFiles = await Promise.all(acceptedFiles.map(f => uploadFn(f)));
        onFinishUploadAll?.(allFiles);
      } catch (error) {
        console.error(error);
        setProgress({});
        showSnack({
          severity: 'error',
          message: 'Не удалось загрузить файлы',
          id: 'uploaderr',
        });
      }
    },
    onDropRejected: fileRejections => {
      for (const fileRejection of fileRejections) {
        const joinErr = fileRejection.errors.map(e => e.message).join('. ');
        showSnack({
          severity: 'error',
          message: joinErr,
          id: fileRejection.file.name,
        });
      }
    },
  });

  return {
    open,
    progress,
    getInputProps,
  };
};
