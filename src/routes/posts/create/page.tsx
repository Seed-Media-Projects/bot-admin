import { FileInfo, useUploader } from '@core/files';
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
import { useEffect, useState } from 'react';
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import { intervalTypeOptions, postTargetOptions, privacyViewOptions } from '../constants';
import { createPostPackAction } from './action';
import { createPostPackLoader } from './loader';

const CreatePostPackPage = () => {
  const { groups, groupPacks } = useLoaderData() as { groups: VkGroupItem[]; groupPacks: GroupPackItem[] };
  const [postFiles, setPostFiles] = useState<FileInfo[]>([]);
  const [postFiles2, setPostFiles2] = useState<FileInfo[]>([]);
  const [groupPackId, setGroupPackId] = useState<number | null>(null);
  const [groupPackDetail, setGroupPackDetail] = useState<GroupPackDetail | null>(null);
  const [multipleDesc, setMultipleDesc] = useState(false);
  const [multipleDesc2, setMultipleDesc2] = useState(false);
  const [withReplace, setWithReplace] = useState(false);
  const [postTarget, setPostTarget] = useState<'toAllGroups' | 'groupPacks' | 'group'>('groupPacks');
  const postUploader = useUploader({ onFinishUpload: f => setPostFiles(v => v.concat(f)) });
  const postUploader2 = useUploader({ onFinishUpload: f => setPostFiles2(v => v.concat(f)) });

  const navigation = useNavigation();
  const isLoading = navigation.formData?.get('toAllGroups') != null;

  const actionData = useActionData() as { error: string } | undefined;
  const isPostsFileUploading = !!objKeys(postUploader.progress).length;
  const isPostsFileUploading2 = !!objKeys(postUploader2.progress).length;

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
        Создание поста
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
              label="Несколько подписей"
            />
          </FormGroup>
        ) : null}

        {multipleDesc ? (
          postTarget === 'groupPacks' ? (
            groupPackDetail?.packItems.map(g => (
              <TextField
                key={g.id}
                margin="normal"
                multiline
                rows={4}
                fullWidth
                label={`Подпись для ${g.group.name}`}
                name={`groupsText_${g.group.id}`}
                type="text"
              />
            ))
          ) : postTarget === 'toAllGroups' ? (
            groups.map(g => (
              <TextField
                key={g.id}
                margin="normal"
                multiline
                rows={4}
                fullWidth
                label={`Подпись для ${g.name}`}
                name={`groupsText_${g.id}`}
                type="text"
              />
            ))
          ) : (
            <TextField
              margin="normal"
              multiline
              rows={4}
              fullWidth
              label={`Подпись для группы`}
              name="allGroupsText"
              type="text"
            />
          )
        ) : (
          <TextField
            margin="normal"
            multiline
            rows={4}
            fullWidth
            label={`Подпись для всех групп`}
            name="allGroupsText"
            type="text"
          />
        )}

        <input type="hidden" name="postFiles" value={JSON.stringify(postFiles)} />
        <input {...postUploader.getInputProps()} />
        <Box display="flex" gap={2} flexDirection="column" my={2}>
          <Button
            sx={{ width: 'max-content' }}
            variant="contained"
            disabled={isPostsFileUploading || isLoading}
            onClick={postUploader.open}
          >
            {isPostsFileUploading ? <CircularProgress size={24} color="primary" /> : 'Добавить вложения'}
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
                {pf.fileType === 'video' ? (
                  <TextField
                    margin="normal"
                    select
                    label="Кто видит"
                    value={pf.privacyView ?? 'all'}
                    onChange={e =>
                      setPostFiles(f =>
                        f.map(all =>
                          all.id === pf.id
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
                <IconButton onClick={() => setPostFiles(f => f.filter(all => all.id !== pf.id))}>
                  <ClearIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>

        <FormGroup>
          <FormControlLabel control={<Switch />} label="Карусель вложений" name="carousel" />
        </FormGroup>

        <TextField margin="normal" fullWidth label="Источник" name="sourceLink" type="text" />
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
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <TextField margin="normal" fullWidth label="Удаление интервал" name="deleteInterval" type="number" />
          <TextField margin="normal" select name="deleteIntervalType" defaultValue={IntervalTypes.Seconds}>
            {intervalTypeOptions.map(o => (
              <MenuItem key={o.value} value={o.value}>
                {o.title}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <TextField margin="normal" multiline rows={4} fullWidth label="Первый коммент" name="firstComment" type="text" />

        <FormGroup>
          <FormControlLabel control={<Switch />} label="Закрыть комменты" name="closedComments" />
        </FormGroup>

        <FormGroup>
          <FormControlLabel
            control={<Switch checked={withReplace} onChange={(_, checked) => setWithReplace(checked)} />}
            label="Нужна ли автоподмена поста?"
          />
        </FormGroup>

        {withReplace ? (
          <>
            <Typography variant="h5" sx={{ my: 2 }}>
              Создание автоподмены поста
            </Typography>
            {postTarget !== 'group' ? (
              <FormGroup>
                <FormControlLabel
                  control={<Switch checked={multipleDesc2} onChange={(_, checked) => setMultipleDesc2(checked)} />}
                  label="Несколько подписей"
                />
              </FormGroup>
            ) : null}
            {multipleDesc2 ? (
              postTarget === 'groupPacks' ? (
                groupPackDetail?.packItems.map(g => (
                  <TextField
                    key={g.id}
                    margin="normal"
                    multiline
                    rows={4}
                    fullWidth
                    label={`Подпись для ${g.group.name}`}
                    name={`replaceItemPost.groupsText_${g.group.id}`}
                    type="text"
                  />
                ))
              ) : postTarget === 'toAllGroups' ? (
                groups.map(g => (
                  <TextField
                    key={g.id}
                    margin="normal"
                    multiline
                    rows={4}
                    fullWidth
                    label={`Подпись для ${g.name}`}
                    name={`replaceItemPost.groupsText_${g.id}`}
                    type="text"
                  />
                ))
              ) : (
                <TextField
                  margin="normal"
                  multiline
                  rows={4}
                  fullWidth
                  label={`Подпись для группы`}
                  name="replaceItemPost.allGroupsText"
                  type="text"
                />
              )
            ) : (
              <TextField
                margin="normal"
                multiline
                rows={4}
                fullWidth
                label={`Подпись для всех групп`}
                name="replaceItemPost.allGroupsText"
                type="text"
              />
            )}

            <input type="hidden" name="replaceItemPost.postFiles" value={JSON.stringify(postFiles2)} />
            <input {...postUploader2.getInputProps()} />
            <Box display="flex" gap={2} flexDirection="column" my={2}>
              <Button
                sx={{ width: 'max-content' }}
                variant="contained"
                disabled={isPostsFileUploading2 || isLoading}
                onClick={postUploader2.open}
              >
                {isPostsFileUploading2 ? <CircularProgress size={24} color="primary" /> : 'Добавить вложения'}
              </Button>
              {postFiles2.map(pf => (
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
                    {pf.fileType === 'video' ? (
                      <TextField
                        margin="normal"
                        select
                        label="Кто видит"
                        value={pf.privacyView ?? 'all'}
                        onChange={e =>
                          setPostFiles2(f =>
                            f.map(all =>
                              all.id === pf.id
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
                    <IconButton onClick={() => setPostFiles2(f => f.filter(all => all.id !== pf.id))}>
                      <ClearIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
            <FormGroup>
              <FormControlLabel control={<Switch />} label="Карусель вложений" name="replaceItemPost.carousel" />
            </FormGroup>
            <TextField margin="normal" fullWidth label="Источник" name="replaceItemPost.sourceLink" type="text" />

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
              }}
            >
              <TextField margin="normal" fullWidth label="Когда заменить?" required name="replaceInterval" type="number" />
              <TextField margin="normal" select name="replaceIntervalType" defaultValue={IntervalTypes.Seconds}>
                {intervalTypeOptions.map(o => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.title}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <TextField
              margin="normal"
              multiline
              rows={4}
              fullWidth
              label="Первый коммент"
              name="replaceItemPost.firstComment"
              type="text"
            />

            <FormGroup>
              <FormControlLabel control={<Switch />} label="Закрыть комменты" name="replaceItemPost.closedComments" />
            </FormGroup>
          </>
        ) : null}

        <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 3, mb: 2 }}>
          {isLoading ? <CircularProgress size={24} color="primary" /> : 'create'}
        </Button>

        {actionData && actionData.error ? <p style={{ color: 'red' }}>{actionData.error}</p> : null}
      </Form>
    </Box>
  );
};

export const Component = CreatePostPackPage;
export const loader = createPostPackLoader;
export const action = createPostPackAction;
