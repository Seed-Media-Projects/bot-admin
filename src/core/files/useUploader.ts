import { useUnit } from 'effector-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { showSnack } from '../snacks/store';
import { uploadFileFX } from './api';
import { FileInfo } from './types';

const oneMB = 1048576;

export const useUploader = ({
  onFinishUpload,
  from = 'ducky',
}: {
  onFinishUpload: (f: FileInfo) => void;
  from?: 'ducky' | 'priceme';
}) => {
  const loading = useUnit(uploadFileFX.pending);
  const [progress, setProgress] = useState(0);

  const { open, getInputProps } = useDropzone({
    accept: {
      'image/png': [],
      'image/webp': [],
      'image/jpeg': [],
      'image/jpg': [],
      'image/gif': [],
      'image/svg+xml': [],
    },
    maxSize: oneMB * 10,
    disabled: loading,
    maxFiles: 1,
    onDrop: (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async file => {
        const data = await uploadFileFX({
          file,
          onUploadProgress: p => {
            setProgress(Math.round((p.loaded * 100) / (p.total ?? 0)));
          },
          from,
        });
        setProgress(0);
        onFinishUpload(data);
      });
    },
    onDropRejected: e => {
      let errText = 'Не удалось загрузить файл';
      if (e?.[0]?.errors?.[0]?.message?.includes('larger')) {
        errText = 'Файл слишком большой';
      }

      showSnack({
        severity: 'error',
        message: errText,
      });
    },
  });

  return {
    open,
    progress,
    getInputProps,
  };
};
