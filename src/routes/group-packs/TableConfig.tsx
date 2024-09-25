import { deleteGroupPackFX, GroupPackItem } from '@core/group-packs';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Typography } from '@mui/material';
import { ActionModal } from '@ui/modal/ActionModal';
import { actionsConfig, RowOptionsIcons } from '@ui/table/RowOptions';
import { typographyColumn } from '@ui/table/config-elements';
import { useUnit } from 'effector-react';
import { useState } from 'react';
import { ColumnShape } from 'react-base-table';
import { useNavigate } from 'react-router-dom';

export const tableGroupPacksConfig: ColumnShape<GroupPackItem>[] = [
  {
    title: 'Name',
    ...typographyColumn({ dataKey: 'name' }),
  },
  {
    key: 'packItems',
    title: 'Кол групп',
    width: 80,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      return (
        <div>
          <Typography sx={{ whiteSpace: 'normal' }}>{rowData.packItems.length}</Typography>
        </div>
      );
    },
  },
  {
    ...actionsConfig(),
    cellRenderer: ({ rowData }) => <Actions groupPack={rowData} />,
  },
];

const Actions = ({ groupPack }: { groupPack: GroupPackItem }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const loading = useUnit(deleteGroupPackFX.pending);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <RowOptionsIcons
      options={[
        {
          icon: EditIcon,
          name: 'Detail',
          link: `/group-packs/${groupPack.id}`,
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
              deleteGroupPackFX(groupPack.id).then(() => {
                handleClose();
                navigate('.');
              });
            }}
            open={open}
            title={`Delete group pack: ${groupPack.name}`}
            subtitle="Are you sure?"
          />
        </>
      }
    />
  );
};
