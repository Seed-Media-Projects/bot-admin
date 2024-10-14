import { deleteScheduleFX, ScheduleItem } from '@core/schedule';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, Typography } from '@mui/material';
import { ActionModal } from '@ui/modal/ActionModal';
import { actionsConfig, RowOptionsIcons } from '@ui/table/RowOptions';
import { typographyColumn } from '@ui/table/config-elements';
import { useUnit } from 'effector-react';
import { useState } from 'react';
import { ColumnShape } from 'react-base-table';
import { useNavigate } from 'react-router-dom';

export const tableSchedulesConfig: ColumnShape<ScheduleItem>[] = [
  {
    title: 'Id',
    ...typographyColumn({ dataKey: 'id' }),
    width: 60,
  },
  {
    title: 'Name',
    ...typographyColumn({ dataKey: 'name' }),
  },
  {
    title: 'Time',
    key: 'scheduleData',
    width: 600,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      return (
        <Box display="flex" gap={1} sx={{ overflowX: 'auto' }}>
          {rowData.scheduleData.times.map(arrItem => (
            <Typography sx={{ whiteSpace: 'normal' }} key={`${arrItem}`}>
              {arrItem}
            </Typography>
          ))}
        </Box>
      );
    },
  },
  {
    ...actionsConfig(),
    cellRenderer: ({ rowData }) => <Actions schedule={rowData} />,
  },
];

const Actions = ({ schedule }: { schedule: ScheduleItem }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const loading = useUnit(deleteScheduleFX.pending);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <RowOptionsIcons
      options={[
        {
          icon: EditIcon,
          name: 'Edit',
          link: `/schedule/${schedule.id}`,
        },
      ]}
      deleteBtn={
        <>
          <IconButton onClick={handleOpen}>
            <DeleteIcon />
          </IconButton>
          <ActionModal
            loading={loading}
            onClose={handleClose}
            onConfirm={() => {
              deleteScheduleFX(schedule.id).then(() => {
                handleClose();
                navigate('.', { replace: true });
              });
            }}
            open={open}
            title={`Delete schedule: ${schedule.name}`}
            subtitle="Are you sure?"
          />
        </>
      }
    />
  );
};
