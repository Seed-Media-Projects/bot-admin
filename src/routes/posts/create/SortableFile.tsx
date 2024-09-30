import { FileInfo } from '@core/files';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import { SetStateAction } from 'react';
import { privacyViewOptions } from '../constants';

type Props = {
  fileInfo: FileInfo;
  setPostFiles: (value: SetStateAction<FileInfo[]>) => void;
};

export const SortableFile = ({ fileInfo, setPostFiles }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: fileInfo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        width: '100%',
        padding: 1,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid rgba(0, 0, 0, 0.23)',
        gap: 2,
        cursor: 'grab',
        ':active': {
          cursor: 'grabbing',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {fileInfo.fileType === 'video' ? (
          <Box
            width={50}
            height={50}
            sx={{
              border: '1px solid rgba(0, 0, 0, 0.23)',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography>MP4</Typography>
          </Box>
        ) : (
          <Box
            component="img"
            src={import.meta.env.VITE_SERVER_URL + fileInfo.url}
            width={50}
            height={50}
            sx={{
              objectFit: 'contain',
              border: '1px solid rgba(0, 0, 0, 0.23)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          />
        )}
        <Typography noWrap sx={{ maxWidth: 200 }}>
          {fileInfo.fileName}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}>
        {fileInfo.fileType === 'video' ? (
          <TextField
            margin="normal"
            select
            label="Кто видит"
            value={fileInfo.privacyView ?? 'all'}
            onChange={e =>
              setPostFiles(f =>
                f.map(all =>
                  all.id === fileInfo.id
                    ? {
                        ...all,
                        privacyView: e.target.value as 'all' | 'members',
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
        <IconButton onClick={() => setPostFiles(f => f.filter(all => all.id !== fileInfo.id))}>
          <ClearIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
