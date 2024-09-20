import { FileInfo, useUploader } from '@core/files';
import { getGroupPackFX, GroupPackDetail, GroupPackItem } from '@core/group-packs';
import { VkGroupItem } from '@core/groups';
import { VkPostStatus } from '@core/posts';
import { VkStoryPackDetail } from '@core/stories';
import { objKeys } from '@core/utils/mappings';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { intervalTypeOptions, postStatusBundle, postTargetOptions } from '@routes/posts/constants';
import { getValuesFromInterval } from '@routes/posts/utils';
import { CustomAvatar } from '@ui/table/config-elements';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Form, useLoaderData } from 'react-router-dom';
import { storyTextOptions } from '../constants';
import { editStoryPackLoader } from './loader';

const EditStoryPackPage = () => {
  const { groups, groupPacks, story } = useLoaderData() as {
    groups: VkGroupItem[];
    groupPacks: GroupPackItem[];

    story: VkStoryPackDetail | null;
  };
  const [postFiles, setPostFiles] = useState<FileInfo[]>([]);
  const [groupPackId, setGroupPackId] = useState<number | null>(null);
  const [groupPackDetail, setGroupPackDetail] = useState<GroupPackDetail | null>(null);
  const [multipleDesc, setMultipleDesc] = useState(false);
  const [postTarget, setPostTarget] = useState<'toAllGroups' | 'groupPacks' | 'group'>('groupPacks');
  const postUploader = useUploader({ onFinishUpload: f => setPostFiles([f]), maxFiles: 1 });

  const isPostsFileUploading = !!objKeys(postUploader.progress).length;

  // const navigation = useNavigation();
  // const isLoading = navigation.formData?.get('toAllGroups') != null;

  useEffect(() => {
    if (groupPackId) {
      getGroupPackFX(groupPackId).then(r => setGroupPackDetail(r));
    }
  }, [groupPackId]);

  useEffect(() => {
    if (story) {
      setPostTarget(story.toAllGroups ? 'toAllGroups' : story.groupPack ? 'groupPacks' : 'group');
      if (story.groupPack) {
        setGroupPackId(story.groupPack.id);
      }
      setPostFiles([
        {
          fileType: story.fileType,
          privacyView: null,
          fileName: story.file.name ?? '',
          id: story.file.id,
          url: story.file.fileUrl,
        },
      ]);
      setMultipleDesc(!story.settings.allGroupsText);
    }
  }, [story]);

  if (!story) {
    return <Typography>Story not found</Typography>;
  }

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 500,
        margin: 'auto',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Сторис инфо
      </Typography>
      <Typography variant="h6" gutterBottom>
        Статусы
      </Typography>
      <Box my={2}>
        {objKeys(story.settings.groupStoryStatus).map(gpk => {
          const { status, error } = story.settings.groupStoryStatus[gpk];

          const fixStatus = (status as unknown as string) === 'succes' ? VkPostStatus.Success : status;

          const Icon = postStatusBundle[fixStatus].icon;

          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>{groups.find(g => g.id === Number(gpk))?.name}</Typography>
              <CustomAvatar color={postStatusBundle[fixStatus].color}>
                <Tooltip title={error ?? postStatusBundle[fixStatus].tooltip ?? ''} placement="top" arrow>
                  <Icon />
                </Tooltip>
              </CustomAvatar>
            </Box>
          );
        })}
      </Box>
      <Form method="post" style={{ width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          select
          label="Куда постим?"
          name="postTarget"
          value={postTarget}
          onChange={e => setPostTarget(e.target.value as typeof postTarget)}
          disabled
        >
          {postTargetOptions.map(o => (
            <MenuItem key={o.value} value={o.value}>
              {o.title}
            </MenuItem>
          ))}
        </TextField>

        {postTarget === 'groupPacks' ? (
          <TextField
            margin="normal"
            required
            fullWidth
            select
            label="Group packs"
            name="groupPackId"
            onChange={e => setGroupPackId(Number(e.target.value))}
            defaultValue={story.groupPack?.id}
            disabled
          >
            {groupPacks.map(o => (
              <MenuItem key={o.id} value={o.id}>
                {o.name}
              </MenuItem>
            ))}
          </TextField>
        ) : null}
        {postTarget === 'group' ? (
          <TextField
            disabled
            margin="normal"
            required
            fullWidth
            select
            label="Group"
            name="groupId"
            defaultValue={story.group?.id}
          >
            {groups.map(o => (
              <MenuItem key={o.id} value={o.id}>
                {o.name}
              </MenuItem>
            ))}
          </TextField>
        ) : null}

        {postTarget !== 'group' ? (
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={multipleDesc} onChange={(_, checked) => setMultipleDesc(checked)} />}
              label="Разные кнопки"
              disabled
            />
          </FormGroup>
        ) : null}

        {multipleDesc ? (
          postTarget === 'groupPacks' ? (
            groupPackDetail?.packItems.map(g => (
              <TextField
                margin="normal"
                key={g.id}
                select
                name={`groupsText_${g.group.id}`}
                label={`Кнопка для ${g.group.name}`}
                fullWidth
                defaultValue={story.settings.groupsText?.[g.group.id] ?? ''}
                disabled
              >
                {storyTextOptions.map(o => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.title}
                  </MenuItem>
                ))}
              </TextField>
            ))
          ) : postTarget === 'toAllGroups' ? (
            groups.map(g => (
              <TextField
                fullWidth
                margin="normal"
                key={g.id}
                select
                name={`groupsText_${g.id}`}
                label={`Кнопка для ${g.name}`}
                defaultValue={story.settings.groupsText?.[g.id] ?? ''}
                disabled
              >
                {storyTextOptions.map(o => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.title}
                  </MenuItem>
                ))}
              </TextField>
            ))
          ) : (
            <TextField
              fullWidth
              margin="normal"
              select
              name="allGroupsText"
              label={`Кнопка для группы`}
              defaultValue={story.settings.allGroupsText ?? ''}
              disabled
            >
              {storyTextOptions.map(o => (
                <MenuItem key={o.value} value={o.value}>
                  {o.title}
                </MenuItem>
              ))}
            </TextField>
          )
        ) : (
          <TextField
            fullWidth
            margin="normal"
            select
            name="allGroupsText"
            label={`Кнопка для всех групп`}
            defaultValue={story.settings.allGroupsText ?? ''}
            disabled
          >
            {storyTextOptions.map(o => (
              <MenuItem key={o.value} value={o.value}>
                {o.title}
              </MenuItem>
            ))}
          </TextField>
        )}

        <input type="hidden" name="file" value={postFiles.length ? JSON.stringify(postFiles[0]) : undefined} />
        <input {...postUploader.getInputProps()} />
        <Box display="flex" gap={2} flexDirection="column" my={2}>
          <Button sx={{ width: 'max-content' }} variant="contained" disabled onClick={postUploader.open}>
            {isPostsFileUploading ? <CircularProgress size={24} color="primary" /> : 'Добавить файл'}
          </Button>
          {postFiles.map(pf => (
            <Box
              key={pf.id}
              sx={{
                width: '100%',
                padding: 1,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid rgba(0, 0, 0, 0.23)',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {pf.fileType === 'video' ? (
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
                    src={import.meta.env.VITE_SERVER_URL + pf.url}
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
                  {pf.fileName}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}>
                <IconButton disabled onClick={() => setPostFiles(f => f.filter(all => all.id !== pf.id))}>
                  <ClearIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>

        <TextField
          margin="normal"
          fullWidth
          label="Время поста"
          name="postDate"
          type="datetime-local"
          defaultValue={story.postDate ? dayjs(story.postDate).format('YYYY-MM-DDTHH:mm') : undefined}
          disabled
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <TextField
            margin="normal"
            fullWidth
            label="Пост интервал"
            name="postInterval"
            type="number"
            defaultValue={story.postInterval ? getValuesFromInterval(story.postInterval).value : undefined}
            disabled
          />
          <TextField
            margin="normal"
            select
            name="postIntervalType"
            defaultValue={story.postInterval ? getValuesFromInterval(story.postInterval).type : undefined}
            disabled
          >
            {intervalTypeOptions.map(o => (
              <MenuItem key={o.value} value={o.value}>
                {o.title}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Form>
    </Box>
  );
};

export const Component = EditStoryPackPage;
export const loader = editStoryPackLoader;
