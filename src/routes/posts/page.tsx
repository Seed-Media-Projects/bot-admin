import { VkPostPackItem } from '@core/posts';
import { Button, CardHeader, Link } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { BaseList } from '@ui/table/BaseTable';
import { useLoaderData } from 'react-router-dom';
import { postPacksLoader } from './loader';
import { tablePostPacksConfig } from './TableConfig';

const PostPacksPage = () => {
  const { posts } = useLoaderData() as { posts: VkPostPackItem[] };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <BaseList
          data={posts}
          config={tablePostPacksConfig}
          listHeader={
            <CardHeader
              title="Vk Post Packs"
              action={
                <Link href="/posts/create">
                  <Button variant="contained">Add post pack</Button>
                </Link>
              }
            />
          }
        />
      </Grid>
    </Grid>
  );
};

export const Component = PostPacksPage;
export const loader = postPacksLoader;
