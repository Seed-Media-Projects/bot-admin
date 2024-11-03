import { VkReplacePostItem } from '@core/replace-posts';
import { Button, CardHeader } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { BaseList } from '@ui/table/BaseTable';
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { postsReplaceLoader } from './loader';
import { ReplaceLinksModal } from './ReplaceLinksModal';
import { tableReplacePostsConfig } from './TableConfig';

const ReplacePostsPage = () => {
  const { posts } = useLoaderData() as { posts: VkReplacePostItem[] };
  const [open, setOpen] = useState(false);

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <BaseList
          data={posts}
          config={tableReplacePostsConfig}
          listHeader={
            <CardHeader
              title="Вк замена постов"
              action={
                <Button onClick={() => setOpen(true)} variant="contained">
                  Добавить
                </Button>
              }
            />
          }
        />
      </Grid>
      <ReplaceLinksModal open={open} setOpen={setOpen} />
    </Grid>
  );
};

export const Component = ReplacePostsPage;
export const loader = postsReplaceLoader;
