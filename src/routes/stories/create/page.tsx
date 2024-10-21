import { deleteFileFX, FileInfo, useUploader } from '@core/files';
import { getGroupPackFX, GroupPackDetail, GroupPackItem } from '@core/group-packs';
import { VkGroupItem } from '@core/groups';
import { IntervalTypes } from '@core/posts';
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
  Typography,
} from '@mui/material';
import { intervalTypeOptions, postTargetOptions } from '@routes/posts/constants';
import { useUnit } from 'effector-react';
import { Fragment, useEffect, useState } from 'react';
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import { storyTextOptions } from '../constants';
import { createStoryPackAction } from './action';
import { createStoryPackLoader } from './loader';

const CreateStoryPackPage = () => {
  const { groups, groupPacks } = useLoaderData() as { groups: VkGroupItem[]; groupPacks: GroupPackItem[] };
  const [postFiles, setPostFiles] = useState<FileInfo[]>([]);
  const [groupPackId, setGroupPackId] = useState<number | null>(null);
  const [groupPackDetail, setGroupPackDetail] = useState<GroupPackDetail | null>(null);
  const [multipleDesc, setMultipleDesc] = useState(false);
  const [postTarget, setPostTarget] = useState<'toAllGroups' | 'groupPacks' | 'group'>('groupPacks');
  const postUploader = useUploader({ onFinishUpload: f => setPostFiles([f]), maxFiles: 1 });
  const isDeleteLoading = useUnit(deleteFileFX.pending);

  const navigation = useNavigation();
  const isLoading = navigation.formData?.get('toAllGroups') != null;

  const actionData = useActionData() as { error: string } | undefined;
  const isPostsFileUploading = !!objKeys(postUploader.progress).length;

  useEffect(() => {
    if (groupPackId) {
      getGroupPackFX(groupPackId).then(r => setGroupPackDetail(r));
    }
  }, [groupPackId]);

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
        Создание сторис
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
          onChange={e => setPostTarget(e.target.value as typeof postTarget)}
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
          >
            {groupPacks.map(o => (
              <MenuItem key={o.id} value={o.id}>
                {o.name}
              </MenuItem>
            ))}
          </TextField>
        ) : null}
        {postTarget === 'group' ? (
          <TextField margin="normal" required fullWidth select label="Group" name="groupId">
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
            />
          </FormGroup>
        ) : null}

        {multipleDesc ? (
          postTarget === 'groupPacks' ? (
            groupPackDetail?.packItems.map(g => (
              <Fragment key={g.id}>
                <TextField
                  margin="normal"
                  key={g.id}
                  select
                  name={`groupsText_${g.group.id}`}
                  label={`Кнопка для ${g.group.name}`}
                  fullWidth
                >
                  {storyTextOptions.map(o => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.title}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  margin="normal"
                  name={`groupsLink_${g.group.id}`}
                  label={`Ссылка для ${g.group.name}`}
                />
              </Fragment>
            ))
          ) : postTarget === 'toAllGroups' ? (
            groups.map(g => (
              <Fragment key={g.id}>
                <TextField
                  fullWidth
                  margin="normal"
                  key={g.id}
                  select
                  name={`groupsText_${g.id}`}
                  label={`Кнопка для ${g.name}`}
                >
                  {storyTextOptions.map(o => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.title}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField fullWidth margin="normal" name={`groupsLink_${g.id}`} label={`Ссылка для ${g.name}`} />
              </Fragment>
            ))
          ) : (
            <>
              <TextField fullWidth margin="normal" select name="allGroupsText" label={`Кнопка для группы`}>
                {storyTextOptions.map(o => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.title}
                  </MenuItem>
                ))}
              </TextField>
              <TextField fullWidth margin="normal" name="allGroupsLink" label={`Ссылка для группы`} />
            </>
          )
        ) : (
          <>
            <TextField fullWidth margin="normal" select name="allGroupsText" label={`Кнопка для всех групп`}>
              {storyTextOptions.map(o => (
                <MenuItem key={o.value} value={o.value}>
                  {o.title}
                </MenuItem>
              ))}
            </TextField>
            <TextField fullWidth margin="normal" name="allGroupsLink" label={`Ссылка для всех групп`} />
          </>
        )}

        <input type="hidden" name="file" value={postFiles.length ? JSON.stringify(postFiles[0]) : undefined} />
        <input {...postUploader.getInputProps()} />
        <Box display="flex" gap={2} flexDirection="column" my={2}>
          <Button
            sx={{ width: 'max-content' }}
            variant="contained"
            disabled={isPostsFileUploading || isLoading || isDeleteLoading}
            onClick={postUploader.open}
          >
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
                <IconButton
                  onClick={async () => {
                    await deleteFileFX(pf.id);
                    setPostFiles(f => f.filter(all => all.id !== pf.id));
                  }}
                >
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
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            htmlInput: {
              min: new Date().toISOString().slice(0, 16),
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
          <TextField margin="normal" fullWidth label="Пост интервал" name="postInterval" type="number" />
          <TextField margin="normal" select name="postIntervalType" defaultValue={IntervalTypes.Seconds}>
            {intervalTypeOptions.map(o => (
              <MenuItem key={o.value} value={o.value}>
                {o.title}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 3, mb: 2 }}>
          {isLoading ? <CircularProgress size={24} color="primary" /> : 'create'}
        </Button>

        {actionData && actionData.error ? <p style={{ color: 'red' }}>{actionData.error}</p> : null}
      </Form>
    </Box>
  );
};

export const Component = CreateStoryPackPage;
export const loader = createStoryPackLoader;
export const action = createStoryPackAction;
