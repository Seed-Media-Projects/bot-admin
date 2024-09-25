import { AccountItem } from '@core/accounts';
import { deleteGroupFX, VkGroupItem } from '@core/groups';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Typography } from '@mui/material';
import { ActionModal } from '@ui/modal/ActionModal';
import { actionsConfig, RowOptionsIcons } from '@ui/table/RowOptions';
import { avatarImgColumn, typographyColumn, typographyDateColumn } from '@ui/table/config-elements';
import { useUnit } from 'effector-react';
import { useState } from 'react';
import { ColumnShape } from 'react-base-table';
import { useLoaderData, useNavigate } from 'react-router-dom';

export const tableGroupsConfig: ColumnShape<VkGroupItem>[] = [
  {
    title: 'Id',
    ...typographyColumn({ dataKey: 'id' }),
    width: 60,
  },
  {
    title: 'Ava',
    ...avatarImgColumn({ dataKey: 'photo' }),
    width: 40,
  },
  {
    title: 'Name',
    ...typographyColumn({ dataKey: 'name' }),
  },
  {
    title: 'Created',
    ...typographyDateColumn({ dataKey: 'created' }),
  },
  {
    title: 'Created by',
    key: 'vkUserId',
    width: 200,
    sortable: false,
    cellRenderer: ({ rowData }) => <CreatedBy group={rowData} />,
  },
  {
    ...actionsConfig(),
    cellRenderer: ({ rowData }) => <Actions group={rowData} />,
  },
];

const CreatedBy = ({ group }: { group: VkGroupItem }) => {
  const { accounts } = useLoaderData() as { accounts: AccountItem[] };

  return <Typography>{accounts.find(a => a.vkUserId === group.vkUserId)?.vkInfo?.name}</Typography>;
};

const Actions = ({ group }: { group: VkGroupItem }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const loading = useUnit(deleteGroupFX.pending);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <RowOptionsIcons
      options={[
        {
          icon: EditIcon,
          name: 'Edit',
          link: `/groups/${group.id}`,
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
              deleteGroupFX(group.id).then(() => {
                handleClose();
                navigate('.');
              });
            }}
            open={open}
            title={`Delete account: ${group.name}`}
            subtitle="Are you sure?"
          />
        </>
      }
    />
  );
};
