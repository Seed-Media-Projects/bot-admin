import { FilePrivacyView, deleteFileFX } from '@core/files';
import { CreateMassPostingItem } from '@core/mass-posting';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, IconButton, MenuItem, TextField } from '@mui/material';
import { privacyViewOptions } from '@routes/posts/constants';
import dayjs from 'dayjs';
import { SetStateAction } from 'react';

type Props = {
  massPostingItem: CreateMassPostingItem;
  changeItem: (item: CreateMassPostingItem) => void;
  setUploadedOrderItems: (
    value: SetStateAction<
      {
        fileId: number;
        postDate: string;
      }[]
    >,
  ) => void;
  setItems: (value: SetStateAction<CreateMassPostingItem[]>) => void;
};

export const PostingItem = ({ massPostingItem, changeItem, setUploadedOrderItems, setItems }: Props) => {
  return (
    <Box
      key={massPostingItem.files[0].fileId}
      sx={{
        width: '100%',
        padding: 1,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        border: '1px solid rgba(0, 0, 0, 0.23)',
        gap: 2,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: '100%',
          padding: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box>
          <Box>{dayjs(massPostingItem.postDate).format('HH:mm')}</Box>
          <Box>{dayjs(massPostingItem.postDate).format('DD MMMM YYYY')}</Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {massPostingItem.files[0].fileType === 'video' ? (
            <Box
              width={250}
              height={250}
              sx={{
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
              }}
              component="video"
              controls
              muted
              loop
              playsInline
              crossOrigin="anonymous"
              autoPlay
              src={import.meta.env.VITE_SERVER_URL + massPostingItem.files[0].fileUrl}
            />
          ) : (
            <Box
              component="img"
              src={import.meta.env.VITE_SERVER_URL + massPostingItem.files[0].fileUrl}
              width={250}
              height={250}
              sx={{
                objectFit: 'contain',
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '.25rem', flexShrink: 0 }}>
          {massPostingItem.files[0].fileType === 'video' ? (
            <TextField
              margin="normal"
              select
              label="Кто видит"
              value={massPostingItem.files[0].privacyView}
              fullWidth
              sx={{
                flexShrink: 0,
                minWidth: '12vw',
              }}
              onChange={e =>
                changeItem({
                  ...massPostingItem,
                  files: [
                    {
                      ...massPostingItem.files[0],
                      privacyView: e.target.value as FilePrivacyView,
                    },
                  ],
                })
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
            color="error"
            sx={{
              position: 'absolute',
              zIndex: 1,
              top: 0,
              right: -2,
            }}
            onClick={async () => {
              await deleteFileFX(massPostingItem.files[0].fileId);
              setUploadedOrderItems(f => f.filter(all => all.fileId !== massPostingItem.files[0].fileId));
              setItems(f => f.filter(all => all.files[0].fileId !== massPostingItem.files[0].fileId));
            }}
          >
            <ClearIcon />
          </IconButton>
        </Box>
      </Box>
      <TextField
        type="text"
        label="Название файла"
        fullWidth
        value={massPostingItem.files[0].fileName}
        onChange={e =>
          changeItem({
            ...massPostingItem,
            files: [
              {
                ...massPostingItem.files[0],
                fileName: e.target.value,
              },
            ],
          })
        }
      />
      <TextField
        multiline
        rows={4}
        fullWidth
        label="Tекст поста"
        type="text"
        value={massPostingItem.groupsText}
        onChange={e =>
          changeItem({
            ...massPostingItem,
            groupsText: e.target.value,
          })
        }
      />
    </Box>
  );
};
