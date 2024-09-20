import { VkStoryPackItem } from '@core/stories';
import { Button, CardHeader, Link } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { BaseList } from '@ui/table/BaseTable';
import { useLoaderData } from 'react-router-dom';
import { storyPacksLoader } from './loader';
import { tableStoryPacksConfig } from './TableConfig';

const StoryPacksPage = () => {
  const { stories } = useLoaderData() as { stories: VkStoryPackItem[] };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <BaseList
          data={stories}
          config={tableStoryPacksConfig}
          listHeader={
            <CardHeader
              title="Vk Story Packs"
              action={
                <Link href="/stories/create">
                  <Button variant="contained">Add story</Button>
                </Link>
              }
            />
          }
        />
      </Grid>
    </Grid>
  );
};

export const Component = StoryPacksPage;
export const loader = storyPacksLoader;
