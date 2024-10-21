import { VkMassPosting } from '@core/mass-posting';
import { Button, CardHeader, Link } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { BaseList } from '@ui/table/BaseTable';
import { useLoaderData } from 'react-router-dom';
import { massPostingsLoader } from './loader';
import { tableMassPostingConfig } from './TableConfig';

const MassPostingPage = () => {
  const { massPostings } = useLoaderData() as { massPostings: VkMassPosting[] };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <BaseList
          data={massPostings}
          config={tableMassPostingConfig}
          listHeader={
            <CardHeader
              title="Вк Массовый постинг"
              action={
                <Link href="/mass-posting/create">
                  <Button variant="contained">Добавить</Button>
                </Link>
              }
            />
          }
        />
      </Grid>
    </Grid>
  );
};

export const Component = MassPostingPage;
export const loader = massPostingsLoader;
