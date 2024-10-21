import { deleteFileFX, FileInfo, FilePrivacyView, useUploader } from '@core/files';
import { GroupPackItem } from '@core/group-packs';
import { VkGroupItem } from '@core/groups';
import { CreateMassPostingItem } from '@core/mass-posting';
import { ScheduleItem } from '@core/schedule';
import { objKeys } from '@core/utils/mappings';
import CachedIcon from '@mui/icons-material/Cached';
import { Box, Button, CircularProgress, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import { postTargetOptions, privacyViewOptions } from '@routes/posts/constants';
import { ActionModal } from '@ui/modal/ActionModal';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useUnit } from 'effector-react';
import { useEffect, useState } from 'react';
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import { massPostingPeriodOptions, sortOptions } from '../constants';
import { arrayShuffle } from '../utils';
import { createMassPostingAction } from './action';
import { createMassPostingLoader } from './loader';
import { PostingItem } from './PostingItem';
dayjs.extend(utc);

const CreateMassPostingPage = () => {
  const { groups, groupPacks, schedules } = useLoaderData() as {
    groups: VkGroupItem[];
    groupPacks: GroupPackItem[];
    schedules: ScheduleItem[];
  };
  const [massPostingItems, setItems] = useState<CreateMassPostingItem[]>([]);
  const [uploadedOrderItems, setUploadedOrderItems] = useState<{ fileId: number; postDate: string }[]>([]);
  const [postTarget, setPostTarget] = useState<'toAllGroups' | 'groupPacks' | 'group'>('groupPacks');
  const [postPeriod, setPostPeriod] = useState<'schedule' | 'fromTime'>('schedule');
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [fromTime, setFromTime] = useState<string>('');
  const [sortType, setSortType] = useState<'ASC' | 'DESC' | 'RAND'>('ASC');
  const [allTextOpen, setAllTextOpen] = useState(false);
  const [allText, setAllText] = useState('');
  const [allPWOpen, setAllPWOpen] = useState(false);
  const [allPW, setAllPW] = useState<FilePrivacyView>('all');
  const isDeleteLoading = useUnit(deleteFileFX.pending);

  const upsertItems = (files: FileInfo[]) => {
    let upItems = massPostingItems;
    let upOrdItems = uploadedOrderItems;

    for (const file of files) {
      const lastMassPostingItem = upItems.at(-1);

      const indexOfLastMassPostingItem = lastMassPostingItem ? upItems.indexOf(lastMassPostingItem) : -1;
      const scheduleTimeByIndex = selectedSchedule
        ? selectedSchedule.scheduleData.times[indexOfLastMassPostingItem + 1]
        : null;

      if (postPeriod === 'schedule' && !scheduleTimeByIndex) {
        return;
      }

      const currentDate = dayjs().format('YYYY-MM-DD');
      const newItem: CreateMassPostingItem = {
        files: [
          {
            fileId: file.id,
            fileUrl: file.url,
            fileType: file.fileType,
            position: 1,
            privacyView: allPW,
            fileName: file.fileName,
          },
        ],
        position: upItems.length + 1,
        postDate:
          postPeriod === 'fromTime'
            ? lastMassPostingItem
              ? dayjs(lastMassPostingItem.postDate).add(1, 'h').utc().format()
              : dayjs(fromTime).add(1, 'h').utc().format()
            : postPeriod === 'schedule' && scheduleTimeByIndex
              ? dayjs(`${currentDate} ${scheduleTimeByIndex}`, 'YYYY-MM-DD HH:mm').utc().format()
              : '',

        groupsText: '',
      };
      upItems = upItems.concat(newItem);
      upOrdItems = upOrdItems.concat({
        fileId: file.id,
        postDate: newItem.postDate,
      });
    }

    setItems(upItems);
    setUploadedOrderItems(upOrdItems);
  };

  const postUploader = useUploader({ onFinishUploadAll: upsertItems });
  const isPostsFileUploading = !!objKeys(postUploader.progress).length;

  const navigation = useNavigation();
  const isLoading = navigation.formData?.get('toAllGroups') != null;
  const isAllActionsLoading = isPostsFileUploading || isLoading || isDeleteLoading;
  const isAddMoreDisabled =
    isAllActionsLoading ||
    (postPeriod === 'schedule' && massPostingItems.length === selectedSchedule?.scheduleData.times.length);

  const actionData = useActionData() as { error: string } | undefined;

  // когда меняем время, то удаляем файлы
  useEffect(() => {
    Promise.all(massPostingItems.map(i => deleteFileFX(i.files[0].fileId))).then(() => {
      setItems([]);
      setUploadedOrderItems([]);
      setSortType('ASC');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postPeriod, selectedSchedule, fromTime]);

  const changeItem = (item: CreateMassPostingItem) => {
    setItems(v => v.map(v => (v.files[0].fileId === item.files[0].fileId ? item : v)));
  };

  const randomSort = () => {
    const newShuffled = arrayShuffle(uploadedOrderItems);

    const newItems = newShuffled
      .map((uor, index) => {
        const item = massPostingItems.find(mpi => mpi.files[0].fileId === uor.fileId);

        if (!item) {
          return undefined;
        }

        return {
          ...item,
          postDate: uploadedOrderItems[index].postDate,
        };
      })
      .filter(Boolean) as CreateMassPostingItem[];

    setItems(newItems);
  };

  const applySort = (sortingValue: typeof sortType) => {
    switch (sortingValue) {
      case 'ASC': {
        const uploadedOrderItemsToMutate = [...uploadedOrderItems];
        const newItems = uploadedOrderItemsToMutate
          .map((uor, index) => {
            const item = massPostingItems.find(mpi => mpi.files[0].fileId === uor.fileId);

            if (!item) {
              return undefined;
            }

            return {
              ...item,
              postDate: uploadedOrderItems[index].postDate,
            };
          })
          .filter(Boolean) as CreateMassPostingItem[];

        setItems(newItems);
        break;
      }
      case 'DESC':
        {
          const uploadedOrderItemsToMutate = [...uploadedOrderItems];
          const newItems = uploadedOrderItemsToMutate
            .reverse()
            .map((uor, index) => {
              const item = massPostingItems.find(mpi => mpi.files[0].fileId === uor.fileId);

              if (!item) {
                return undefined;
              }

              return {
                ...item,
                postDate: uploadedOrderItems[index].postDate,
              };
            })
            .filter(Boolean) as CreateMassPostingItem[];

          setItems(newItems);
        }
        break;

      default:
        break;
    }

    setSortType(sortingValue);
  };

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
        Создание
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
          <TextField margin="normal" required fullWidth select label="Group packs" name="groupPackId">
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

        <TextField
          margin="normal"
          required
          fullWidth
          select
          label="Как постим?"
          value={postPeriod}
          onChange={e => setPostPeriod(e.target.value as typeof postPeriod)}
        >
          {massPostingPeriodOptions.map(o => (
            <MenuItem key={o.value} value={o.value}>
              {o.title}
            </MenuItem>
          ))}
        </TextField>

        {postPeriod === 'fromTime' ? (
          <TextField
            margin="normal"
            required
            fullWidth
            label="Каждый час начиная с"
            type="datetime-local"
            value={fromTime}
            onChange={e => setFromTime(e.target.value)}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              htmlInput: {
                min: new Date().toISOString().slice(0, 16),
              },
            }}
          />
        ) : null}

        {postPeriod === 'schedule' ? (
          <TextField
            margin="normal"
            required
            fullWidth
            select
            label="Расписание"
            value={selectedSchedule?.id}
            onChange={e => setSelectedSchedule(schedules.find(s => s.id === Number(e.target.value))!)}
          >
            {schedules.map(o => (
              <MenuItem key={o.id} value={o.id}>
                {o.name}
              </MenuItem>
            ))}
          </TextField>
        ) : null}

        {(postPeriod === 'fromTime' && !fromTime) || (postPeriod === 'schedule' && !selectedSchedule) ? null : (
          <>
            <input type="hidden" name="items" value={JSON.stringify(massPostingItems)} />
            <input {...postUploader.getInputProps()} />
            <Box display="flex" gap={2} flexDirection="column" my={2}>
              <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                <Button variant="contained" disabled={isAddMoreDisabled} onClick={postUploader.open}>
                  {isPostsFileUploading ? <CircularProgress size={24} color="primary" /> : 'Добавить вложения'}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  disabled={isAllActionsLoading}
                  onClick={async () => {
                    await Promise.all(massPostingItems.map(i => deleteFileFX(i.files[0].fileId)));
                    setUploadedOrderItems([]);
                    setItems([]);
                  }}
                >
                  {isDeleteLoading ? <CircularProgress size={24} color="primary" /> : 'Удалить вложения'}
                </Button>
                <Button variant="contained" color="info" disabled={isAllActionsLoading} onClick={() => setAllTextOpen(true)}>
                  Задать общий текст
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  disabled={isAllActionsLoading}
                  onClick={() => setAllPWOpen(true)}
                >
                  Общая видимость видео
                </Button>

                <Box display="flex" gap={1} alignItems="center">
                  <TextField
                    margin="normal"
                    select
                    label="Расположение"
                    value={sortType}
                    fullWidth
                    onChange={e => applySort(e.target.value as typeof sortType)}
                  >
                    {sortOptions.map(o => (
                      <MenuItem key={o.value} value={o.value}>
                        {o.title}
                      </MenuItem>
                    ))}
                  </TextField>
                  {sortType === 'RAND' && (
                    <IconButton onClick={randomSort}>
                      <CachedIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
              {massPostingItems.map(massPostingItem => (
                <PostingItem
                  key={massPostingItem.files[0].fileId}
                  changeItem={changeItem}
                  massPostingItem={massPostingItem}
                  setItems={setItems}
                  setUploadedOrderItems={setUploadedOrderItems}
                />
              ))}
            </Box>
          </>
        )}

        <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 3, mb: 2 }}>
          {isLoading ? <CircularProgress size={24} color="primary" /> : 'create'}
        </Button>

        {actionData && actionData.error ? <p style={{ color: 'red' }}>{actionData.error}</p> : null}
      </Form>
      <ActionModal
        loading={false}
        onClose={() => setAllTextOpen(false)}
        onConfirm={() => {
          setItems(v =>
            v.map(it => ({
              ...it,
              groupsText: allText,
            })),
          );
          setAllTextOpen(false);
        }}
        open={allTextOpen}
        title="Задать общий текст"
        confirmColor="primary"
        subtitle={
          <TextField
            multiline
            rows={4}
            fullWidth
            label="Tекст для всех постов"
            type="text"
            value={allText}
            onChange={e => setAllText(e.target.value)}
            sx={{ my: 2 }}
          />
        }
      />
      <ActionModal
        loading={false}
        onClose={() => setAllPWOpen(false)}
        onConfirm={() => {
          setItems(v =>
            v.map(it => ({
              ...it,
              files: [
                {
                  ...it.files[0],
                  privacyView: allPW,
                },
              ],
            })),
          );
          setAllPWOpen(false);
        }}
        open={allPWOpen}
        title="Поменять кому видно видео"
        confirmColor="primary"
        subtitle={
          <TextField
            margin="normal"
            select
            value={allPW}
            fullWidth
            sx={{
              my: 2,
            }}
            onChange={e => setAllPW(e.target.value as FilePrivacyView)}
          >
            {privacyViewOptions.map(o => (
              <MenuItem key={o.value} value={o.value}>
                {o.title}
              </MenuItem>
            ))}
          </TextField>
        }
      />
    </Box>
  );
};

export const Component = CreateMassPostingPage;
export const loader = createMassPostingLoader;
export const action = createMassPostingAction;
