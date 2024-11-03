import { FileInfo } from '@core/files';
import { VkGroupItem } from '@core/groups';
import { IntervalTypes, VkPostStatus } from '@core/posts';
import { VkReplacePostDetail } from '@core/replace-posts';
import { objKeys } from '@core/utils/mappings';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, FormControlLabel, FormGroup, MenuItem, Switch, TextField, Tooltip, Typography } from '@mui/material';
import { intervalTypeOptions, postStatusBundle } from '@routes/posts/constants';
import { SortableFile } from '@routes/posts/create/SortableFile';
import { getValuesFromInterval } from '@routes/posts/utils';
import { CustomAvatar } from '@ui/table/config-elements';
import { useEffect, useState } from 'react';
import { Form, useLoaderData } from 'react-router-dom';
import { editReplacePostLoader } from './loader';

const EditReplacePostPage = () => {
  const { groups, replacePostData } = useLoaderData() as {
    groups: VkGroupItem[];
    replacePostData: VkReplacePostDetail | null;
  };

  const [postFiles, setPostFiles] = useState<FileInfo[]>([]);
  const [multipleDesc, setMultipleDesc] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (replacePostData) {
      setPostFiles(
        replacePostData.files.map(f => ({
          fileName: f.file.name ?? 'file',
          fileType: f.fileType,
          privacyView: f.privacyView,
          id: f.file.id,
          url: f.file.fileUrl,
        })),
      );
      setMultipleDesc(!replacePostData.settings.allLinksText && !!objKeys(replacePostData.settings.linksText ?? {}).length);
    }
  }, [replacePostData]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPostFiles(items => {
        const oldIndex = items.findIndex(v => v.id === active.id);
        const newIndex = items.findIndex(v => v.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (!replacePostData) {
    return <Typography>Replace post not found</Typography>;
  }

  const validLinks = replacePostData.settings.links;

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
      <Typography variant="h6" gutterBottom>
        Статусы
      </Typography>
      <Box my={2}>
        {objKeys(replacePostData.settings.linksPostStatus).map(gpk => {
          const { status, error } = replacePostData.settings.linksPostStatus[gpk];

          const fixStatus = (status as unknown as string) === 'succes' ? VkPostStatus.Success : status;

          const Icon = postStatusBundle[fixStatus].icon;
          return (
            <Box key={gpk} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>https://vk.com/wall-{gpk}</Typography>
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
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={multipleDesc} onChange={(_, checked) => setMultipleDesc(checked)} />}
            label="Несколько подписей"
            disabled
          />
        </FormGroup>

        {multipleDesc ? (
          validLinks.map(l => (
            <TextField
              key={l}
              margin="normal"
              multiline
              rows={4}
              fullWidth
              label={`Подпись для ${groups.find(g => l.includes(`${g.groupId}`))?.name} ссылка ${l}`}
              type="text"
              disabled
              defaultValue={replacePostData.settings.linksText?.[l.replace('https://vk.com/wall-', '')] ?? ''}
            />
          ))
        ) : (
          <TextField
            margin="normal"
            multiline
            rows={4}
            fullWidth
            label={`Подпись для всех ссылок`}
            name="allLinksText"
            type="text"
            disabled
            defaultValue={replacePostData.settings.allLinksText}
          />
        )}

        <Box display="flex" gap={2} flexDirection="column" my={2}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={postFiles} strategy={verticalListSortingStrategy}>
              {postFiles.map(pf => (
                <SortableFile key={pf.id} fileInfo={pf} setPostFiles={setPostFiles} disabled />
              ))}
            </SortableContext>
          </DndContext>
        </Box>

        <FormGroup>
          <FormControlLabel
            control={<Switch checked={!!replacePostData.settings.carousel} />}
            label="Карусель вложений"
            name="carousel"
            disabled
          />
        </FormGroup>

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
            label="Когда заменить"
            name="replaceInterval"
            type="number"
            disabled
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            defaultValue={
              replacePostData.replaceInterval ? getValuesFromInterval(replacePostData.replaceInterval).value : undefined
            }
          />
          <TextField
            margin="normal"
            select
            name="replaceIntervalType"
            disabled
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            defaultValue={
              replacePostData.replaceInterval
                ? getValuesFromInterval(replacePostData.replaceInterval).type
                : IntervalTypes.Seconds
            }
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
            label="Пост интервал"
            name="postInterval"
            type="number"
            disabled
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            defaultValue={
              replacePostData.postInterval ? getValuesFromInterval(replacePostData.postInterval).value : undefined
            }
          />
          <TextField
            margin="normal"
            select
            name="postIntervalType"
            disabled
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            defaultValue={
              replacePostData.postInterval ? getValuesFromInterval(replacePostData.postInterval).type : IntervalTypes.Seconds
            }
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
            disabled
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            defaultValue={
              replacePostData.deleteInterval ? getValuesFromInterval(replacePostData.deleteInterval).value : undefined
            }
          />
          <TextField
            margin="normal"
            select
            name="deleteIntervalType"
            disabled
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            defaultValue={
              replacePostData.deleteInterval
                ? getValuesFromInterval(replacePostData.deleteInterval).type
                : IntervalTypes.Seconds
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
          defaultValue={replacePostData.settings.firstComment}
        />

        <FormGroup>
          <FormControlLabel
            control={<Switch checked={!!replacePostData.settings.closedComments} />}
            label="Закрыть комменты"
            name="closedComments"
            disabled
          />
        </FormGroup>
      </Form>
    </Box>
  );
};

export const Component = EditReplacePostPage;
export const loader = editReplacePostLoader;
