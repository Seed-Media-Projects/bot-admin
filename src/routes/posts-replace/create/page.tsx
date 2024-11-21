import { deleteFileFX, FileInfo, useUploader } from '@core/files';
import { VkGroupItem } from '@core/groups';
import { IntervalTypes } from '@core/posts';
import { $validLinks } from '@core/replace-posts/store';
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
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { intervalTypeOptions } from '@routes/posts/constants';
import { SortableFile } from '@routes/posts/create/SortableFile';
import { useUnit } from 'effector-react';
import { useState } from 'react';
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import { createPostReplaceAction } from './action';
import { createPostReplaceLoader } from './loader';

const CreateReplacePostPage = () => {
  const validLinks = useUnit($validLinks);
  const { groups } = useLoaderData() as { groups: VkGroupItem[] };

  const [postFiles, setPostFiles] = useState<FileInfo[]>([]);
  const [multipleDesc, setMultipleDesc] = useState(false);
  const postUploader = useUploader({ onFinishUpload: f => setPostFiles(v => v.concat(f)) });
  const isDeleteLoading = useUnit(deleteFileFX.pending);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const navigation = useNavigation();
  const isLoading = !!navigation.formData;

  const actionData = useActionData() as { error: string } | undefined;
  const isPostsFileUploading = !!objKeys(postUploader.progress).length;

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
        Создание замены
      </Typography>
      <Box my={2}>
        {validLinks.map(link => {
          return (
            <Box key={link.value} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>{link.value}</Typography>
            </Box>
          );
        })}
      </Box>
      <Form method="post" style={{ width: '100%' }}>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={multipleDesc} onChange={(_, checked) => setMultipleDesc(checked)} />}
            label="Несколько подписей"
          />
        </FormGroup>

        {multipleDesc ? (
          validLinks.map(l => (
            <TextField
              key={l.value}
              margin="normal"
              multiline
              rows={4}
              fullWidth
              label={`Подпись для ${groups.find(g => g.groupId === l.groupId)?.name} ссылка ${l.value}`}
              name={`linksText_${l.groupId}_${l.postId}`}
              type="text"
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
          />
        )}

        <input type="hidden" name="links" value={JSON.stringify(validLinks.map(l => l.value))} />
        <input type="hidden" name="postFiles" value={JSON.stringify(postFiles)} />
        <input {...postUploader.getInputProps()} />
        <Box display="flex" gap={2} flexDirection="column" my={2}>
          <Button
            sx={{ width: 'max-content' }}
            variant="contained"
            disabled={isPostsFileUploading || isLoading || isDeleteLoading}
            onClick={postUploader.open}
          >
            {isPostsFileUploading ? <CircularProgress size={24} color="primary" /> : 'Добавить вложения'}
          </Button>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={postFiles} strategy={verticalListSortingStrategy}>
              {postFiles.map(pf => (
                <SortableFile key={pf.id} fileInfo={pf} setPostFiles={setPostFiles} />
              ))}
            </SortableContext>
          </DndContext>
        </Box>

        <FormGroup>
          <FormControlLabel control={<Switch />} label="Карусель вложений" name="carousel" />
        </FormGroup>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <TextField margin="normal" fullWidth label="Когда заменить" name="replaceInterval" type="number" />
          <TextField margin="normal" select name="replaceIntervalType" defaultValue={IntervalTypes.Seconds}>
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

        <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 3, mb: 2 }}>
          {isLoading ? <CircularProgress size={24} color="primary" /> : 'Создать'}
        </Button>

        {actionData && actionData.error ? <p style={{ color: 'red' }}>{actionData.error}</p> : null}
      </Form>
    </Box>
  );
};

export const Component = CreateReplacePostPage;
export const action = createPostReplaceAction;
export const loader = createPostReplaceLoader;
