import { ScheduleItem } from '@core/schedule';
import { Button, CardHeader, Link } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { BaseList } from '@ui/table/BaseTable';
import { useLoaderData } from 'react-router-dom';
import { schedulesLoader } from './loader';
import { tableSchedulesConfig } from './TableConfig';

const SchedulesPage = () => {
  const { schedules } = useLoaderData() as { schedules: ScheduleItem[] };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <BaseList
          data={schedules}
          config={tableSchedulesConfig}
          listHeader={
            <CardHeader
              title="Расписание"
              action={
                <Link href="/schedule/create">
                  <Button variant="contained">Создать</Button>
                </Link>
              }
            />
          }
        />
      </Grid>
    </Grid>
  );
};

export const Component = SchedulesPage;
export const loader = schedulesLoader;
