import { VkGroupItem } from '@core/groups';
import { Button, CardHeader, Link } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { BaseList } from '@ui/table/BaseTable';
import { SearchTitle } from '@ui/table/SearchTitle';
import { useLoaderData } from 'react-router-dom';
import { groupsLoader } from './loader';
import { tableGroupsConfig } from './TableConfig';

const GroupsPage = () => {
  const { groups } = useLoaderData() as { groups: VkGroupItem[] };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <BaseList
          data={groups}
          config={tableGroupsConfig}
          listHeader={
            <CardHeader
              title={<SearchTitle title="Vk Groups" />}
              action={
                <Link href="/groups/connect">
                  <Button variant="contained">Add groups</Button>
                </Link>
              }
            />
          }
        />
      </Grid>
    </Grid>
  );
};

export const Component = GroupsPage;
export const loader = groupsLoader;
