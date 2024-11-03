import { deleteReplacePostFX, VkReplacePostItem } from '@core/replace-posts';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { postStatusBundle } from '@routes/posts/constants';
import { ActionModal } from '@ui/modal/ActionModal';
import { actionsConfig, RowOptionsIcons } from '@ui/table/RowOptions';
import { CustomAvatar, typographyColumn, typographyDateColumn } from '@ui/table/config-elements';
import { useUnit } from 'effector-react';
import { useState } from 'react';
import { ColumnShape } from 'react-base-table';
import { useNavigate } from 'react-router-dom';

export const tableReplacePostsConfig: ColumnShape<VkReplacePostItem>[] = [
  {
    title: 'Id',
    ...typographyColumn({ dataKey: 'id' }),
    width: 60,
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
    cellRenderer: ({ rowData }) => <Actions replacePost={rowData} />,
  },
];

const Actions = ({ replacePost }: { replacePost: VkReplacePostItem }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const loading = useUnit(deleteReplacePostFX.pending);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <RowOptionsIcons
      options={[
        {
          icon: EditIcon,
          name: 'Detail',
          link: `/posts-replace/${replacePost.id}`,
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
              deleteReplacePostFX(replacePost.id).then(() => {
                handleClose();
                navigate('.', { replace: true });
              });
            }}
            open={open}
            title={`Delete: ${replacePost.id}`}
            subtitle="Are you sure?"
          />
        </>
      }
    />
  );
};
