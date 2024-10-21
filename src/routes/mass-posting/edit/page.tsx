import { deleteFileFX, FilePrivacyView } from '@core/files';
import { GroupPackItem } from '@core/group-packs';
import { VkGroupItem } from '@core/groups';
import { CreateMassPostingItem, VkMassPostingDetail } from '@core/mass-posting';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import { postTargetOptions, privacyViewOptions } from '@routes/posts/constants';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';
import { Form, useLoaderData } from 'react-router-dom';
import { editMassPostingLoader } from './loader';
dayjs.extend(utc);

const EditMassPostingPage = () => {
  const { groups, groupPacks, massPostingData } = useLoaderData() as {
    groups: VkGroupItem[];
    groupPacks: GroupPackItem[];
    massPostingData: VkMassPostingDetail | null;
  };
  const [massPostingItems, setItems] = useState<CreateMassPostingItem[]>([]);
  const [postTarget, setPostTarget] = useState<'toAllGroups' | 'groupPacks' | 'group'>('groupPacks');

  useEffect(() => {
    if (massPostingData) {
      console.debug(massPostingData);
      setItems(
        massPostingData.items.map(v => ({
          files: v.files.map(vf => ({
            fileId: vf.file.id,
            fileUrl: vf.file.fileUrl,
            fileType: vf.fileType,
            fileName: vf.fileName ?? vf.file.name ?? '',
            privacyView: vf.privacyView,
            position: vf.position,
          })),
          position: v.position,
          postDate: v.postDate,
          groupsText: v.settings.groupsText,
        })),
      );
      setPostTarget(massPostingData.toAllGroups ? 'toAllGroups' : massPostingData.groupPack ? 'groupPacks' : 'group');
    }
  }, [massPostingData]);

  const changeItem = (item: CreateMassPostingItem) => {
    setItems(v => v.map(v => (v.position === item.position ? item : v)));
  };

  if (!massPostingData) {
    return <Typography>Mass posting not found</Typography>;
  }

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '80vw',
        margin: 'auto',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Инфо
      </Typography>
      <Form method="post" style={{ width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          select
          label="Куда постим?"
          name="postTarget"
          value={postTarget}
          disabled
          onChange={e => setPostTarget(e.target.value as typeof postTarget)}
        >
          {postTargetOptions.map(o => (
            <MenuItem key={o.value} value={o.value}>
              {o.title}
            </MenuItem>
          ))}
        </TextField>

        {postTarget === 'groupPacks' ? (
          <TextField margin="normal" disabled required fullWidth select label="Group packs" name="groupPackId">
            {groupPacks.map(o => (
              <MenuItem key={o.id} value={o.id}>
                {o.name}
              </MenuItem>
            ))}
          </TextField>
        ) : null}
        {postTarget === 'group' ? (
          <TextField margin="normal" disabled required fullWidth select label="Group" name="groupId">
            {groups.map(o => (
              <MenuItem key={o.id} value={o.id}>
                {o.name}
              </MenuItem>
            ))}
          </TextField>
        ) : null}

        <Box display="flex" gap={2} flexDirection="column" my={2}>
          {massPostingItems.map(massPostingItem => (
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
                      disabled
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
                    disabled
                    onClick={async () => {
                      await deleteFileFX(massPostingItem.files[0].fileId);
                      setItems(f => f.filter(all => all.position !== massPostingItem.position));
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
                disabled
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
                disabled
                onChange={e =>
                  changeItem({
                    ...massPostingItem,
                    groupsText: e.target.value,
                  })
                }
              />
            </Box>
          ))}
        </Box>
      </Form>
    </Box>
  );
};

export const Component = EditMassPostingPage;
export const loader = editMassPostingLoader;
