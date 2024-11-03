import { deleteFileFX, FileInfo, FilePrivacyView } from '@core/files';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ClearIcon from '@mui/icons-material/Clear';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, Button, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import { SetStateAction } from 'react';
import { privacyViewOptions } from '../constants';
type Props = {
  fileInfo: FileInfo;
  setPostFiles: (value: SetStateAction<FileInfo[]>) => void;
  disabled?: boolean;
};

export const SortableFile = ({ fileInfo, setPostFiles, disabled }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: fileInfo.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <Box
      style={style}
      sx={{
        width: '100%',
        padding: 1,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid rgba(0, 0, 0, 0.23)',
        gap: 2,

        position: 'relative',
      }}
    >
      <Button
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          cursor: 'grab',
          ':active': {
            cursor: 'grabbing',
          },
        }}
        variant="contained"
        ref={setNodeRef}
        {...attributes}
        {...listeners}
      >
        <DragIndicatorIcon />
      </Button>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {fileInfo.fileType === 'video' ? (
          <Box
            width={250}
            height={250}
            sx={{
              border: '1px solid rgba(0, 0, 0, 0.23)',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            component="video"
            controls
            muted
            loop
            playsInline
            crossOrigin="anonymous"
            autoPlay
            src={import.meta.env.VITE_SERVER_URL + fileInfo.url}
          />
        ) : (
          <Box
            component="img"
            src={import.meta.env.VITE_SERVER_URL + fileInfo.url}
            width={250}
            height={250}
            sx={{
              objectFit: 'contain',
              border: '1px solid rgba(0, 0, 0, 0.23)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          />
        )}
        <Typography noWrap>{fileInfo.fileName}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}>
        {fileInfo.fileType === 'video' ? (
          <TextField
            margin="normal"
            select
            label="Кто видит"
            value={fileInfo.privacyView ?? 'all'}
            disabled={disabled}
            onChange={e =>
              setPostFiles(f =>
                f.map(all =>
                  all.id === fileInfo.id
                    ? {
                        ...all,
                        privacyView: e.target.value as FilePrivacyView,
                      }
                    : all,
                ),
              )
            }
          >
            {privacyViewOptions.map(o => (
              <MenuItem key={o.value} value={o.value}>
                {o.title}
              </MenuItem>
            ))}
          </TextField>
        ) : null}
        <IconButton
          onClick={async e => {
            e.preventDefault();
            e.stopPropagation();
            await deleteFileFX(fileInfo.id);
            setPostFiles(f => f.filter(all => all.id !== fileInfo.id));
          }}
          disabled={disabled}
        >
          <ClearIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
