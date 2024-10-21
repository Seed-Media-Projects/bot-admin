import { GroupPackItem } from '@core/group-packs';
import { VkGroupItem } from '@core/groups';
import { deleteMassPostingFX, VkMassPosting } from '@core/mass-posting';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Typography } from '@mui/material';
import { ActionModal } from '@ui/modal/ActionModal';
import { actionsConfig, RowOptionsIcons } from '@ui/table/RowOptions';
import { typographyColumn, typographyDateColumn } from '@ui/table/config-elements';
import { useUnit } from 'effector-react';
import { useState } from 'react';
import { ColumnShape } from 'react-base-table';
import { useLoaderData, useNavigate } from 'react-router-dom';

export const tableMassPostingConfig: ColumnShape<VkMassPosting>[] = [
  {
    title: 'Id',
    ...typographyColumn({ dataKey: 'id' }),
    width: 60,
  },
  {
    key: 'toAllGroups',
    title: 'Target',
    width: 200,
    sortable: false,
    cellRenderer: ({ rowData }) => <Target massPosting={rowData} />,
  },
  {
    title: 'Created',
    ...typographyDateColumn({ dataKey: 'created' }),
  },

  {
    ...actionsConfig(),
    width: 150,
    cellRenderer: ({ rowData }) => <Actions massPosting={rowData} />,
  },
];

const Target = ({ massPosting }: { massPosting: VkMassPosting }) => {
  const { groups, groupPacks } = useLoaderData() as { groups: VkGroupItem[]; groupPacks: GroupPackItem[] };

  return (
    <Typography>
      {massPosting.toAllGroups
        ? 'All groups'
        : massPosting.vk_group_pack_id
          ? groupPacks.find(gp => gp.id === massPosting.vk_group_pack_id)?.name
          : groups.find(g => g.id === massPosting.vk_user_group_id)?.name ?? '-'}
    </Typography>
  );
};

const Actions = ({ massPosting }: { massPosting: VkMassPosting }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const loading = useUnit(deleteMassPostingFX.pending);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <RowOptionsIcons
      options={[
        {
          icon: EditIcon,
          name: 'Detail',
          link: `/mass-posting/${massPosting.id}`,
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
              deleteMassPostingFX(massPosting.id).then(() => {
                handleClose();
                navigate('.', { replace: true });
              });
            }}
            open={open}
            title={`Delete mass posting: ${massPosting.id}`}
            subtitle="Are you sure?"
          />
        </>
      }
    />
  );
};
