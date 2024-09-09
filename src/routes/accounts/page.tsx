import { AccountItem, getAccountConnectLinkFX } from '@core/accounts';
import { LoadingButton } from '@mui/lab';
import { CardHeader } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { BaseList } from '@ui/table/BaseTable';
import { useUnit } from 'effector-react';
import { useCallback } from 'react';
import { useLoaderData } from 'react-router-dom';
import { accountsLoader } from './loader';
import { tableAccountsConfig } from './TableConfig';

const AccountsPage = () => {
  const { accounts } = useLoaderData() as { accounts: AccountItem[] };
  const loading = useUnit(getAccountConnectLinkFX.pending);

  const openConnectLink = useCallback(() => {
    getAccountConnectLinkFX().then(v => window.open(v, '_blank'));
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <BaseList
          data={accounts}
          config={tableAccountsConfig}
          listHeader={
            <CardHeader
              title="Vk Accounts"
              action={
                <LoadingButton loading={loading} onClick={openConnectLink} variant="contained">
                  Add acc
                </LoadingButton>
              }
            />
          }
        />
      </Grid>
    </Grid>
  );
};

export const Component = AccountsPage;
export const loader = accountsLoader;
