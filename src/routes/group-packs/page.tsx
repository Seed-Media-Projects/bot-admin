import { GroupPackItem } from '@core/group-packs';
import { Button, CardHeader, Link } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { BaseList } from '@ui/table/BaseTable';
import { useLoaderData } from 'react-router-dom';
import { groupPacksLoader } from './loader';
import { tableGroupPacksConfig } from './TableConfig';

const GroupPacksPage = () => {
  const { groupPacks } = useLoaderData() as { groupPacks: GroupPackItem[] };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <BaseList
          data={groupPacks}
          config={tableGroupPacksConfig}
          listHeader={
            <CardHeader
              title="Vk Group Packs"
              action={
                <Link href="/group-packs/create">
                  <Button variant="contained">Add group pack</Button>
                </Link>
              }
            />
          }
        />
      </Grid>
    </Grid>
  );
};

export const Component = GroupPacksPage;
export const loader = groupPacksLoader;
