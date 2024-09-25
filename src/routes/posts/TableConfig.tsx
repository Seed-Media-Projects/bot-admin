import { GroupPackItem } from '@core/group-packs';
import { VkGroupItem } from '@core/groups';
import { deletePostPackFX, stopPostJobsPackFX, VkPostPackItem } from '@core/posts';
import DeleteIcon from '@mui/icons-material/Delete';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { ActionModal } from '@ui/modal/ActionModal';
import { actionsConfig, RowOptionsIcons } from '@ui/table/RowOptions';
import { CustomAvatar, typographyColumn, typographyDateColumn } from '@ui/table/config-elements';
import { useUnit } from 'effector-react';
import { useState } from 'react';
import { ColumnShape } from 'react-base-table';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { postStatusBundle } from './constants';

export const tablePostPacksConfig: ColumnShape<VkPostPackItem>[] = [
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
    cellRenderer: ({ rowData }) => <Target postPack={rowData} />,
  },
  {
    title: 'Status',
    key: 'status',
    width: 100,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      const data = rowData.settings.status;

      if (!postStatusBundle[data]) {
        return '-';
      }

      const Icon = postStatusBundle[data].icon;
      return (
        <Box sx={{ width: '100%' }}>
          <CustomAvatar color={postStatusBundle[data].color}>
            <Tooltip title={postStatusBundle[data].tooltip ?? ''} placement="top" arrow>
              <Icon />
            </Tooltip>
          </CustomAvatar>
        </Box>
      );
    },
  },
  {
    title: 'Post date',
    ...typographyDateColumn({ dataKey: 'postDate' }),
  },
  {
    key: 'postInterval',
    title: 'Post interval',
    width: 200,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      return (
        <div>
          <Typography sx={{ whiteSpace: 'normal' }}>
            {rowData.postInterval ? JSON.stringify(rowData.postInterval) : '-'}
          </Typography>
        </div>
      );
    },
  },
  {
    key: 'replaceInterval',
    title: 'Replace interval',
    width: 200,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      return (
        <div>
          <Typography sx={{ whiteSpace: 'normal' }}>
            {rowData.replaceInterval ? JSON.stringify(rowData.replaceInterval) : '-'}
          </Typography>
        </div>
      );
    },
  },
  {
    key: 'deleteInterval',
    title: 'Delete interval',
    width: 200,
    sortable: false,
    cellRenderer: ({ rowData }) => {
      return (
        <div>
          <Typography sx={{ whiteSpace: 'normal' }}>
            {rowData.deleteInterval ? JSON.stringify(rowData.deleteInterval) : '-'}
          </Typography>
        </div>
      );
    },
  },
  {
    title: 'Created',
    ...typographyDateColumn({ dataKey: 'created' }),
  },

  {
    ...actionsConfig(),
    width: 150,
    cellRenderer: ({ rowData }) => <Actions postPack={rowData} />,
  },
];

const Target = ({ postPack }: { postPack: VkPostPackItem }) => {
  const { groups, groupPacks } = useLoaderData() as { groups: VkGroupItem[]; groupPacks: GroupPackItem[] };

  return (
    <Typography>
      {postPack.toAllGroups
        ? 'All groups'
        : postPack.vk_group_pack_id
          ? groupPacks.find(gp => gp.id === postPack.vk_group_pack_id)?.name
          : groups.find(g => g.id === postPack.vk_user_group_id)?.name ?? '-'}
    </Typography>
  );
};

const Actions = ({ postPack }: { postPack: VkPostPackItem }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openStop, setOpenStop] = useState(false);
  const loading = useUnit(deletePostPackFX.pending);
  const loadingStop = useUnit(stopPostJobsPackFX.pending);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <RowOptionsIcons
      options={[
        {
          icon: EditIcon,
          name: 'Detail',
          link: `/posts/${postPack.id}`,
        },
      ]}
      deleteBtn={
        <>
          <IconButton onClick={() => setOpenStop(true)} disabled={postPack.settings.stopJobs}>
            <Tooltip title="Остановить постинг">
              <DoNotDisturbIcon />
            </Tooltip>
          </IconButton>
          <IconButton onClick={handleOpen}>
            <DeleteIcon />
          </IconButton>
          <ActionModal
            loading={loading}
            onClose={handleClose}
            onConfirm={() => {
              deletePostPackFX(postPack.id).then(() => {
                handleClose();
                navigate('.');
              });
            }}
            open={open}
            title={`Delete post pack: ${postPack.id}`}
            subtitle="Are you sure?"
          />
          <ActionModal
            loading={loadingStop}
            onClose={() => setOpenStop(false)}
            onConfirm={() => {
              stopPostJobsPackFX(postPack.id).then(() => {
                setOpenStop(false);
                navigate('.');
              });
            }}
            open={openStop}
            title={`Остановить постинг в: ${postPack.id}`}
            subtitle="Подтверждаете действие?"
          />
        </>
      }
    />
  );
};
