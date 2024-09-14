import { FileInfo, useUploader } from '@core/files';
import { objKeys } from '@core/utils/mappings';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, Button, CircularProgress, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { Form, useNavigation } from 'react-router-dom';
import { createPostPackLoader } from './loader';

const CreatePostPackPage = () => {
  // const { groups, groupPacks } = useLoaderData() as { groups: VkGroupItem[]; groupPacks: GroupPackItem[] };
  const [postFiles, setPostFiles] = useState<FileInfo[]>([]);
  const postUploader = useUploader({ onFinishUpload: f => setPostFiles(v => v.concat(f)) });

  const navigation = useNavigation();
  const isLoading = navigation.formData?.get('toAllGroups') != null;

  // const actionData = useActionData() as { error: string } | undefined;
  const isPostsFileUploading = !!objKeys(postUploader.progress).length;

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
      <Form method="post">
        <input type="hidden" name="postFiles" value={JSON.stringify(postFiles)} />
        <input {...postUploader.getInputProps()} />
        <Box display="flex" gap={2} flexDirection="column">
          <Button
            sx={{ width: 'max-content' }}
            variant="contained"
            disabled={isPostsFileUploading || isLoading}
            onClick={postUploader.open}
          >
            {isPostsFileUploading ? <CircularProgress size={24} color="primary" /> : 'Добавить файлы'}
          </Button>
          {postFiles.map(pf => (
            <Box
              sx={{
                width: '100px',
                padding: 2,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
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

              <IconButton>
                <ClearIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Form>
    </Box>
  );
};

export const Component = CreatePostPackPage;
export const loader = createPostPackLoader;
