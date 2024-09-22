import { FileInfo, useUploader } from '@core/files';
import { getGroupPackFX, GroupPackDetail, GroupPackItem } from '@core/group-packs';
import { VkGroupItem } from '@core/groups';
import { VkPostStatus } from '@core/posts';
import { VkStoryPackDetail, VkStoryStats } from '@core/stories';
import { objKeys } from '@core/utils/mappings';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import { Fragment, useEffect, useState } from 'react';
import { Form, useLoaderData } from 'react-router-dom';
import { storyTextOptions } from '../constants';
import { editStoryPackLoader } from './loader';

const EditStoryPackPage = () => {
  const { groups, groupPacks, storyPack, stats } = useLoaderData() as {
    groups: VkGroupItem[];
    groupPacks: GroupPackItem[];

    storyPack: VkStoryPackDetail | null;
    stats: Record<number, VkStoryStats> | null;
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
    if (storyPack) {
      setPostTarget(storyPack.toAllGroups ? 'toAllGroups' : storyPack.groupPack ? 'groupPacks' : 'group');
      if (storyPack.groupPack) {
        setGroupPackId(storyPack.groupPack.id);
      }
      setPostFiles([
        {
          fileType: storyPack.fileType,
          privacyView: null,
          fileName: storyPack.file.name ?? '',
          id: storyPack.file.id,
          url: storyPack.file.fileUrl,
        },
      ]);
      setMultipleDesc(!storyPack.settings.allGroupsText);
    }
  }, [storyPack]);

  if (!storyPack) {
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
        {objKeys(storyPack.settings.groupStoryStatus).map(gpk => {
          const { status, error } = storyPack.settings.groupStoryStatus[gpk];

          const fixStatus = (status as unknown as string) === 'succes' ? VkPostStatus.Success : status;

          const Icon = postStatusBundle[fixStatus].icon;

          return (
            <Box key={gpk} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
            defaultValue={storyPack.groupPack?.id}
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
            defaultValue={storyPack.group?.id}
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
              <Fragment key={g.id}>
                <TextField
                  margin="normal"
                  key={g.id}
                  select
                  name={`groupsText_${g.group.id}`}
                  label={`Кнопка для ${g.group.name}`}
                  fullWidth
                  defaultValue={storyPack.settings.groupsText?.[g.group.id] ?? ''}
                  disabled
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
                  defaultValue={storyPack.settings.groupsLink?.[g.group.id] ?? ''}
                  disabled
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
                  defaultValue={storyPack.settings.groupsText?.[g.id] ?? ''}
                  disabled
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
                  name={`groupsLink_${g.id}`}
                  label={`Ссылка для ${g.name}`}
                  defaultValue={storyPack.settings.groupsLink?.[g.id] ?? ''}
                  disabled
                />
              </Fragment>
            ))
          ) : (
            <>
              <TextField
                fullWidth
                margin="normal"
                select
                name="allGroupsText"
                label={`Кнопка для группы`}
                defaultValue={storyPack.settings.allGroupsText ?? ''}
                disabled
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
                name="allGroupsLink"
                label={`Ссылка для группы`}
                defaultValue={storyPack.settings.allGroupsLink ?? ''}
                disabled
              />
            </>
          )
        ) : (
          <>
            <TextField
              fullWidth
              margin="normal"
              select
              name="allGroupsText"
              label={`Кнопка для всех групп`}
              defaultValue={storyPack.settings.allGroupsText ?? ''}
              disabled
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
              name="allGroupsLink"
              label={`Ссылка для всех групп`}
              defaultValue={storyPack.settings.allGroupsLink ?? ''}
              disabled
            />
          </>
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
          defaultValue={storyPack.postDate ? dayjs(storyPack.postDate).format('YYYY-MM-DDTHH:mm') : undefined}
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
            defaultValue={storyPack.postInterval ? getValuesFromInterval(storyPack.postInterval).value : undefined}
            disabled
          />
          <TextField
            margin="normal"
            select
            name="postIntervalType"
            defaultValue={storyPack.postInterval ? getValuesFromInterval(storyPack.postInterval).type : undefined}
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
      {stats && (
        <>
          <Typography mt={2} variant="h6" gutterBottom>
            Статистика
          </Typography>
          <Box my={2}>
            {objKeys(storyPack.settings.groupStoryStatus).map(gpk => {
              const statsData = stats[gpk];

              return (
                <Box key={gpk}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                      {groups.find(g => g.id === Number(gpk))?.name}
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Просмотры: <b>{statsData.views}</b>
                      </Typography>
                      <Typography>
                        Ответы на историю: <b>{statsData.replies}</b>
                      </Typography>
                      <Typography>
                        Показывает сколько раз ответили на эту историю сообщением через поле под историей:{' '}
                        <b>{statsData.answer}</b>
                      </Typography>
                      <Typography>
                        Расшаривания истории: <b>{statsData.shares}</b>
                      </Typography>
                      <Typography>
                        Новые подписчики: <b>{statsData.subscribers}</b>
                      </Typography>
                      <Typography>
                        Скрытия истории: <b>{statsData.bans}</b>
                      </Typography>
                      <Typography>
                        Переходы по ссылке: <b>{statsData.openLink}</b>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
};

export const Component = EditStoryPackPage;
export const loader = editStoryPackLoader;
