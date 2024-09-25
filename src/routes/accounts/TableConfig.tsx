import { AccountItem, deleteAccountFX } from '@core/accounts';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { ActionModal } from '@ui/modal/ActionModal';
import { RowOptionsIcons, actionsConfig } from '@ui/table/RowOptions';
import {
  avatarImgBundleColumn,
  avatarStatusBundleColumn,
  typographyColumn,
  typographyColumnToKey,
  typographyDateColumn,
} from '@ui/table/config-elements';
import { useUnit } from 'effector-react';
import { useState } from 'react';
import { ColumnShape } from 'react-base-table';
import { useNavigate } from 'react-router-dom';
import { accountsStatusBundle } from './constants';

export const tableAccountsConfig: ColumnShape<AccountItem>[] = [
  {
    title: 'Id',
    ...typographyColumn({ dataKey: 'id' }),
    width: 60,
  },
  {
    title: 'Ava',
    ...avatarImgBundleColumn({ dataKey: 'vkInfo', renderValueKey: 'avatar' }),
    width: 40,
  },
  {
    title: 'Name',
    ...typographyColumnToKey('vkInfo', 'name'),
  },
  {
    title: 'Status',
    ...avatarStatusBundleColumn('tokenStatus', accountsStatusBundle),
    width: 70,
  },
  {
    title: 'Created',
    ...typographyDateColumn({ dataKey: 'created' }),
  },
  {
    title: 'Updated',
    ...typographyDateColumn({ dataKey: 'updated' }),
  },
  {
    ...actionsConfig(),
    cellRenderer: ({ rowData }) => <Actions account={rowData} />,
  },
];

const Actions = ({ account }: { account: AccountItem }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const loading = useUnit(deleteAccountFX.pending);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <RowOptionsIcons
      options={[]}
      deleteBtn={
        <>
          <IconButton onClick={handleOpen}>
            <DeleteIcon />
          </IconButton>
          <ActionModal
            loading={loading}
            onClose={handleClose}
            onConfirm={() => {
              deleteAccountFX(account.id).then(() => {
                handleClose();
                navigate('.', { replace: true });
              });
            }}
            open={open}
            title={`Delete account: ${account.vkInfo?.name}`}
            subtitle="Are you sure?"
          />
        </>
      }
    />
  );
};
