import { FileInfo, useUploader } from '@core/files';
import { getGroupPackFX, GroupPackDetail, GroupPackItem } from '@core/group-packs';
import { VkGroupItem } from '@core/groups';
import { VkPostPackDetailResponse, VkPostStatus } from '@core/posts';
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
import { CustomAvatar } from '@ui/table/config-elements';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Form, useActionData, useLoaderData } from 'react-router-dom';
import { intervalTypeOptions, postStatusBundle, postTargetOptions, privacyViewOptions } from '../constants';
import { getValuesFromInterval } from '../utils';
import { editPostPackLoader } from './loader';

const EditPostPackPage = () => {
  const { groups, groupPacks, postData } = useLoaderData() as {
    groups: VkGroupItem[];
    groupPacks: GroupPackItem[];
    postData: VkPostPackDetailResponse | null;
  };
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

  // const navigation = useNavigation();
  // const isLoading = navigation.formData?.get('toAllGroups') != null;

  const actionData = useActionData() as { error: string } | undefined;
  const isPostsFileUploading = !!objKeys(postUploader.progress).length;
  const isPostsFileUploading2 = !!objKeys(postUploader2.progress).length;

  useEffect(() => {
    if (groupPackId) {
      getGroupPackFX(groupPackId).then(r => setGroupPackDetail(r));
    }
  }, [groupPackId]);

  useEffect(() => {
    if (postData) {
      setPostTarget(postData.post.toAllGroups ? 'toAllGroups' : postData.post.groupPack ? 'groupPacks' : 'group');
      if (postData.post.groupPack) {
        setGroupPackId(postData.post.groupPack.id);
      }
      setPostFiles(
        postData.post.files.map(f => ({
          fileName: f.file.name ?? 'file',
          fileType: f.fileType,
          privacyView: f.privacyView,
          id: f.file.id,
          url: f.file.fileUrl,
        })),
      );
      setMultipleDesc(!postData.post.settings.allGroupsText);
      setWithReplace(!!postData.replacementPost);
      if (postData.replacementPost) {
        setMultipleDesc2(!postData.replacementPost.settings.allGroupsText);
        setPostFiles2(
          postData.replacementPost.files.map(f => ({
            fileName: f.file.name ?? 'file',
            fileType: f.fileType,
            privacyView: f.privacyView,
            id: f.file.id,
            url: f.file.fileUrl,
          })),
        );
      }
    }
  }, [postData]);

  if (!postData) {
    return <Typography>Post pack not found</Typography>;
  }

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 500,
        margin: 'auto',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Инфо поста
      </Typography>
      <Typography variant="h6" gutterBottom>
        Статусы
      </Typography>
      <Box my={2}>
        {objKeys(postData.post.settings.groupPostStatus).map(gpk => {
          const { status, error } = postData.post.settings.groupPostStatus[gpk];

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
            defaultValue={postData.post.groupPack?.id}
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
            margin="normal"
            required
            fullWidth
            select
            label="Group"
            name="groupId"
            defaultValue={postData.post.group?.id}
            disabled
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
              label="Несколько подписей"
              disabled
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
                required
                fullWidth
                label={`Подпись для ${g.group.name}`}
                name={`groupsText_${g.group.id}`}
                type="text"
                defaultValue={postData.post.settings.groupsText?.[g.group.id] ?? ''}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                disabled
              />
            ))
          ) : postTarget === 'toAllGroups' ? (
            groups.map(g => (
              <TextField
                key={g.id}
                margin="normal"
                multiline
                rows={4}
                required
                fullWidth
                label={`Подпись для ${g.name}`}
                name={`groupsText_${g.id}`}
                type="text"
                defaultValue={postData.post.settings.groupsText?.[g.id] ?? ''}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                disabled
              />
            ))
          ) : (
            <TextField
              margin="normal"
              multiline
              rows={4}
              required
              fullWidth
              label={`Подпись для группы`}
              name="allGroupsText"
              type="text"
              defaultValue={postData.post.settings.allGroupsText ?? ''}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              disabled
            />
          )
        ) : (
          <TextField
            margin="normal"
            multiline
            rows={4}
            required
            fullWidth
            label={`Подпись для всех групп`}
            name="allGroupsText"
            type="text"
            defaultValue={postData.post.settings.allGroupsText ?? ''}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            disabled
          />
        )}

        <input type="hidden" name="postFiles" value={JSON.stringify(postFiles)} />
        <input {...postUploader.getInputProps()} />
        <Box display="flex" gap={2} flexDirection="column" my={2}>
          <Button sx={{ width: 'max-content' }} variant="contained" disabled onClick={postUploader.open}>
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
                    disabled
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
                <IconButton disabled onClick={() => setPostFiles(f => f.filter(all => all.id !== pf.id))}>
                  <ClearIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>

        <FormGroup>
          <FormControlLabel
            control={<Switch checked={postData.post.settings.carousel} />}
            label="Карусель вложений"
            name="carousel"
            disabled
          />
        </FormGroup>

        <TextField
          margin="normal"
          fullWidth
          label="Источник"
          name="sourceLink"
          type="text"
          defaultValue={postData.post.settings.sourceLink}
          disabled
        />
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
          defaultValue={postData.post.postDate ? dayjs(postData.post.postDate).format('YYYY-MM-DDTHH:mm') : undefined}
          disabled
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
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            disabled
            defaultValue={postData.post.postInterval ? getValuesFromInterval(postData.post.postInterval).value : undefined}
          />
          <TextField
            margin="normal"
            select
            name="postIntervalType"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            disabled
            defaultValue={postData.post.postInterval ? getValuesFromInterval(postData.post.postInterval).type : undefined}
          >
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
          <TextField
            margin="normal"
            fullWidth
            label="Удаление интервал"
            name="deleteInterval"
            type="number"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            disabled
            defaultValue={
              postData.post.deleteInterval ? getValuesFromInterval(postData.post.deleteInterval).value : undefined
            }
          />
          <TextField
            margin="normal"
            select
            name="deleteIntervalType"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            disabled
            defaultValue={
              postData.post.deleteInterval ? getValuesFromInterval(postData.post.deleteInterval).type : undefined
            }
          >
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
          name="firstComment"
          type="text"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          disabled
          defaultValue={postData.post.settings.firstComment}
        />

        <FormGroup>
          <FormControlLabel
            control={<Switch checked={postData.post.settings.closedComments} />}
            label="Закрыть комменты"
            name="closedComments"
            disabled
          />
        </FormGroup>

        <FormGroup>
          <FormControlLabel
            control={<Switch checked={withReplace} onChange={(_, checked) => setWithReplace(checked)} />}
            label="Нужна ли автоподмена поста?"
            disabled
          />
        </FormGroup>

        {withReplace ? (
          <>
            <Typography variant="h5" sx={{ my: 2 }}>
              Автоподмена поста
            </Typography>
            <Typography variant="h6" gutterBottom>
              Статусы
            </Typography>
            <Box my={2}>
              {objKeys(postData.replacementPost?.settings.groupPostStatus ?? {}).map(gpk => {
                const { status, error } = postData.replacementPost?.settings.groupPostStatus?.[gpk] ?? {
                  status: VkPostStatus.Success,
                };

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
            {postTarget !== 'group' ? (
              <FormGroup>
                <FormControlLabel
                  control={<Switch checked={multipleDesc2} onChange={(_, checked) => setMultipleDesc2(checked)} />}
                  label="Несколько подписей"
                  disabled
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
                    required
                    fullWidth
                    label={`Подпись для ${g.group.name}`}
                    name={`replaceItemPost.groupsText_${g.group.id}`}
                    type="text"
                    defaultValue={postData.replacementPost?.settings.groupsText?.[g.group.id] ?? ''}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    disabled
                  />
                ))
              ) : postTarget === 'toAllGroups' ? (
                groups.map(g => (
                  <TextField
                    key={g.id}
                    margin="normal"
                    multiline
                    rows={4}
                    required
                    fullWidth
                    label={`Подпись для ${g.name}`}
                    name={`replaceItemPost.groupsText_${g.id}`}
                    type="text"
                    defaultValue={postData.replacementPost?.settings.groupsText?.[g.id] ?? ''}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    disabled
                  />
                ))
              ) : (
                <TextField
                  margin="normal"
                  multiline
                  rows={4}
                  required
                  fullWidth
                  label={`Подпись для группы`}
                  name="replaceItemPost.allGroupsText"
                  type="text"
                  defaultValue={postData.replacementPost?.settings.allGroupsText ?? ''}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  disabled
                />
              )
            ) : (
              <TextField
                margin="normal"
                multiline
                rows={4}
                required
                fullWidth
                label={`Подпись для всех групп`}
                name="replaceItemPost.allGroupsText"
                type="text"
                defaultValue={postData.replacementPost?.settings.allGroupsText ?? ''}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                disabled
              />
            )}

            <input type="hidden" name="replaceItemPost.postFiles" value={JSON.stringify(postFiles2)} />
            <input {...postUploader2.getInputProps()} />
            <Box display="flex" gap={2} flexDirection="column" my={2}>
              <Button sx={{ width: 'max-content' }} variant="contained" disabled onClick={postUploader2.open}>
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
                        disabled
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
                    <IconButton disabled onClick={() => setPostFiles2(f => f.filter(all => all.id !== pf.id))}>
                      <ClearIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={!!postData.replacementPost?.settings.carousel} />}
                label="Карусель вложений"
                name="replaceItemPost.carousel"
                disabled
              />
            </FormGroup>
            <TextField
              margin="normal"
              fullWidth
              label="Источник"
              name="replaceItemPost.sourceLink"
              type="text"
              disabled
              defaultValue={postData.replacementPost?.settings.sourceLink}
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
                label="Когда заменить?"
                required
                name="replaceInterval"
                type="number"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                disabled
                defaultValue={
                  postData.post.replaceInterval ? getValuesFromInterval(postData.post.replaceInterval).value : undefined
                }
              />
              <TextField
                margin="normal"
                select
                name="replaceIntervalType"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                disabled
                defaultValue={
                  postData.post.replaceInterval ? getValuesFromInterval(postData.post.replaceInterval).type : undefined
                }
              >
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
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              disabled
              defaultValue={postData.replacementPost?.settings.firstComment}
            />

            <FormGroup>
              <FormControlLabel
                control={<Switch checked={!!postData.replacementPost?.settings.closedComments} />}
                label="Закрыть комменты"
                name="replaceItemPost.closedComments"
                disabled
              />
            </FormGroup>
          </>
        ) : null}
        {/* 
        <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 3, mb: 2 }}>
          {isLoading ? <CircularProgress size={24} color="primary" /> : 'create'}
        </Button> */}

        {actionData && actionData.error ? <p style={{ color: 'red' }}>{actionData.error}</p> : null}
      </Form>
    </Box>
  );
};

export const Component = EditPostPackPage;
export const loader = editPostPackLoader;
